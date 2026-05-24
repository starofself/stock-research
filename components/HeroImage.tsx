"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function HeroImage({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.img src={src} alt="" style={{ y, scale }} className="w-full h-full object-cover opacity-90 will-change-transform" />
    </div>
  );
}
