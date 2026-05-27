export interface SQLMessage {
    role: "user" | "assistant";
    content: string;
}