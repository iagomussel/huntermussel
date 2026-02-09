import { motion } from "framer-motion";
import { useRef } from "react";

interface StackingCardProps {
    children: React.ReactNode;
    index: number;
    totalCards: number;
    className?: string;
}

const StackingCard = ({ children, index, totalCards, className = "" }: StackingCardProps) => {
    const containerRef = useRef<HTMLElement>(null);

    return (
        <section
            ref={containerRef}
            className={`relative min-h-screen w-full bg-background py-20 ${className}`}
        >
            <div className="container mx-auto px-4 md:px-8">
                {children}
            </div>
        </section>
    );
};

export default StackingCard;
