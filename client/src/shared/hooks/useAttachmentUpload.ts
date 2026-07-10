import { useState, useCallback, useRef } from "react";
import { supabase } from "@shared/services/supabase";
import type { AttachmentType } from "@shared/types/support.types";

const BUCKET = "support-attachments";
const MAX_IMAGE_DIMENSION = 1600; // px, long edge
const IMAGE_QUALITY = 0.82;

export interface UploadedAttachment {
    url: string;
    type: AttachmentType;
    name: string;
    size: number;
    thumbnailUrl: string | null;
}

/**
 * Compresses an image file client-side (resizes to MAX_IMAGE_DIMENSION long edge,
 * re-encodes as JPEG/WebP) so phone photos don't upload at 8-12MB.
 */
async function compressImage(file: File): Promise<File> {
    // Skip gifs — canvas re-encode would kill animation
    if (file.type === "image/gif") return file;

    const bitmap = await createImageBitmap(file);
    const { width, height } = bitmap;
    const longEdge = Math.max(width, height);
    const scale = longEdge > MAX_IMAGE_DIMENSION ? MAX_IMAGE_DIMENSION / longEdge : 1;

    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);

    const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", IMAGE_QUALITY)
    );
    if (!blob) return file;

    // Only use the compressed version if it's actually smaller
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
}

/**
 * Grabs a frame ~0.5s into a video as a poster/thumbnail image, uploads it,
 * returns the thumbnail's storage URL.
 */
async function generateVideoPoster(file: File): Promise<Blob | null> {
    return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        const cleanup = () => URL.revokeObjectURL(objectUrl);

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(0.5, video.duration / 2);
        });

        video.addEventListener("seeked", () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                cleanup();
                resolve(null);
                return;
            }
            ctx.drawImage(video, 0, 0);
            canvas.toBlob(
                (blob) => {
                    cleanup();
                    resolve(blob);
                },
                "image/jpeg",
                0.75
            );
        });

        video.addEventListener("error", () => {
            cleanup();
            resolve(null);
        });
    });
}

function detectType(file: File): AttachmentType | null {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return null;
}

function randomName(ext: string) {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
}

export function useAttachmentUpload() {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const cancelRef = useRef(false);

    const upload = useCallback(
        async (file: File, conversationId: string): Promise<UploadedAttachment | null> => {
            const type = detectType(file);
            if (!type) {
                setError("Unsupported file type. Please send an image or video.");
                return null;
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("File is too large (max 50MB).");
                return null;
            }

            setIsUploading(true);
            setProgress(0);
            setError(null);
            cancelRef.current = false;

            try {
                const fileToUpload = type === "image" ? await compressImage(file) : file;
                const ext = fileToUpload.name.split(".").pop() || "bin";
                const path = `${conversationId}/${randomName(ext)}`;

                setProgress(15);

                const { error: uploadError } = await supabase.storage
                    .from(BUCKET)
                    .upload(path, fileToUpload, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: fileToUpload.type,
                    });

                if (uploadError) throw uploadError;
                if (cancelRef.current) return null;

                setProgress(type === "video" ? 55 : 85);

                const {
                    data: { publicUrl },
                } = supabase.storage.from(BUCKET).getPublicUrl(path);

                let thumbnailUrl: string | null = null;

                if (type === "video") {
                    const posterBlob = await generateVideoPoster(file);
                    if (posterBlob && !cancelRef.current) {
                        const posterPath = `${conversationId}/${randomName("jpg")}`;
                        const { error: posterErr } = await supabase.storage
                            .from(BUCKET)
                            .upload(posterPath, posterBlob, {
                                cacheControl: "3600",
                                upsert: false,
                                contentType: "image/jpeg",
                            });
                        if (!posterErr) {
                            thumbnailUrl = supabase.storage.from(BUCKET).getPublicUrl(posterPath).data.publicUrl;
                        }
                    }
                }

                setProgress(100);

                return {
                    url: publicUrl,
                    type,
                    name: file.name,
                    size: fileToUpload.size,
                    thumbnailUrl,
                };
            } catch (err) {
                console.error("Attachment upload failed:", err);
                setError("Upload failed. Please try again.");
                return null;
            } finally {
                setIsUploading(false);
            }
        },
        []
    );

    const cancel = useCallback(() => {
        cancelRef.current = true;
        setIsUploading(false);
        setProgress(0);
    }, []);

    return { upload, cancel, progress, isUploading, error, setError };
}
