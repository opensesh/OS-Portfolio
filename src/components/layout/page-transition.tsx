"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";
import { devProps } from "@/utils/dev-props";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      {...devProps('PageTransition')}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
