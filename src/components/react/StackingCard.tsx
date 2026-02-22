import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StackingCardProps {
    children: React.ReactNode;
    index: number;
    totalCards: number;
    className?: string;
}

const StackingCard = ({ children, index, totalCards, className = "" }: StackingCardProps) => {
    const containerRef = useRef<HTMLElement>(null);
    const [offsets, setOffsets] = useState({ top: 80, stack: 35 });

    useEffect(() => {
        const updateOffsets = () => {
            if (window.innerWidth < 768) {
                // Tighter stack on mobile to keep more content visible
                setOffsets({ top: 60, stack: 10 });
            } else {
                setOffsets({ top: 80, stack: 35 });
            }
        };

        updateOffsets();
        window.addEventListener('resize', updateOffsets);
        return () => window.removeEventListener('resize', updateOffsets);
    }, []);

    const topOffset = offsets.top + index * offsets.stack;

    return (
        <motion.section
            ref={containerRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`sticky flex flex-col overflow-hidden rounded-t-[2.5rem] md:rounded-t-[3.5rem] border-t border-border/50 bg-background shadow-[0_-20px_50px_rgba(0,0,0,0.2)] ${className}`}
            style={{
                top: `${topOffset}px`,
                height: `calc(100vh - ${topOffset}px)`,
                minHeight: `calc(100vh - ${topOffset}px)`,
                zIndex: index + 10
            }}
        >
            <div
                className="h-full w-full overflow-y-auto hide-scrollbar px-6 py-10 md:px-12 md:py-16 overscroll-contain"
                data-lenis-prevent
            >
                <div className="mx-auto w-full max-w-7xl">
                    {children}
                </div>
            </div>
        </motion.section>
    );
};

export default StackingCard;
