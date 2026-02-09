
import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";

interface ParallaxTextProps {
    children: string;
    baseVelocity: number;
    scrollContainerRef?: React.RefObject<HTMLElement>;
}

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100, scrollContainerRef }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll({ container: scrollContainerRef });
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    /**
     * We need to wrap the x value so it loops smoothly
     * The wrap range depends on content width. Using percentages (-20 to -45) is a heuristic
     * Adjust these values if the loop isn't seamless.
     * Assuming 4 repetitions roughly cover enough space.
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * Change direction based on scroll direction
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0">
            <motion.div
                className="font-heading font-black text-6xl md:text-9xl uppercase flex whitespace-nowrap flex-nowrap text-muted-foreground/10"
                style={{ x }}
            >
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
                <span className="block mr-12">{children} </span>
            </motion.div>
        </div>
    );
}

export default function ParallaxSection({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement> }) {
    return (
        <section className="h-full w-full flex flex-col justify-center py-12 border-t border-border overflow-hidden bg-background">
            <ParallaxText baseVelocity={-2} scrollContainerRef={scrollContainerRef}>HUNTER MUSSEL AUTOMATION</ParallaxText>
            <ParallaxText baseVelocity={2} scrollContainerRef={scrollContainerRef}>AI DEVOPS CLOUD NATIVE</ParallaxText>
        </section>
    );
}
