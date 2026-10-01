"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { springPop } from "@/lib/motion";

type Props = {
  src: string;
  alt: string;
  /** CSS width, e.g. "clamp(56px, 7vw, 88px)". */
  size: string;
  rotate?: number;
  className?: string;
  delay?: number;
  float?: boolean;
  draggable?: boolean;
  priority?: boolean;
};

/** A die-cut sticker: slaps on, floats, can be dragged and springs back. */
export function Sticker({ src, alt, size, rotate = 0, className = "", delay = 0, float = true, draggable = true, priority }: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute select-none ${draggable ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
      style={{ width: size }}
      initial={{ opacity: 0, scale: 1.35, rotate: rotate - 14 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ ...springPop, delay }}
      drag={draggable && !reduce}
      dragSnapToOrigin
      dragElastic={0.6}
      whileHover={reduce ? undefined : { scale: 1.06, rotate: rotate - 3, y: -4 }}
      whileDrag={{ scale: 1.12, zIndex: 40 }}
    >
      <div className={float ? "float-y" : ""} style={{ animationDelay: `${-(delay * 7) % 4}s` }}>
        <Image
          src={src}
          alt={alt}
          width={256}
          height={256}
          priority={priority}
          draggable={false}
          className="h-auto w-full drop-shadow-[0_10px_14px_rgba(40,20,10,0.32)]"
        />
      </div>
    </motion.div>
  );
}
