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
    const [offsets, setOffsets] = useState({ top: 80, stack: 40 });

    useEffect(() => {
        const updateOffsets = () => {
            if (window.innerWidth < 768) {
                setOffsets({ top: 60, stack: 15 });
            } else {
                setOffsets({ top: 80, stack: 40 });
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
            className={`sticky flex flex-col overflow-hidden rounded-t-[2.5rem] border-t border-border/50 bg-background shadow-[0_-15px_40px_rgba(0,0,0,0.15)] ${className}`}
            style={{
                top: `${topOffset}px`,
                height: `calc(100vh - ${topOffset}px)`,
                minHeight: `calc(100vh - ${topOffset}px)`,
                zIndex: index + 10
            }}
        >
            <div
                className="h-full w-full overflow-y-auto hide-scrollbar px-6 py-10 md:px-12 md:py-16"
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
