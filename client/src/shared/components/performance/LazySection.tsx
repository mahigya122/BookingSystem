import { useEffect, useRef, useState } from "react";

interface LazySectionProps {
    id?: string;
    children: React.ReactNode;
    rootMargin?: string;
    placeholder?: React.ReactNode;
}

// Centralized observer pool to reuse IntersectionObserver instances
const observers = new Map<string, IntersectionObserver>();
const callbacks = new WeakMap<Element, (isIntersecting: boolean) => void>();

const getObserver = (rootMargin: string): IntersectionObserver => {
    let observer = observers.get(rootMargin);
    if (!observer) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const callback = callbacks.get(entry.target);
                        if (callback) {
                            callback(true);
                        }
                    }
                });
            },
            { rootMargin }
        );
        observers.set(rootMargin, observer);
    }
    return observer;
};

export default function LazySection({
    id,
    children,
    rootMargin = "300px",
    placeholder = null,
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element || visible) return;

        const observer = getObserver(rootMargin);

        const callback = (isIntersecting: boolean) => {
            if (isIntersecting) {
                setVisible(true);
                callbacks.delete(element);
                observer.unobserve(element);
            }
        };

        callbacks.set(element, callback);
        observer.observe(element);

        return () => {
            callbacks.delete(element);
            observer.unobserve(element);
        };
    }, [rootMargin, visible]);

    return (
        <div id={visible ? undefined : id} ref={ref}>
            {visible ? children : placeholder}
        </div>
    );
}