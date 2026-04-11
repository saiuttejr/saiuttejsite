"use client";

import dynamic from "next/dynamic";

const MagneticCursor = dynamic(() => import("@/components/MagneticCursor"), {
  ssr: false,
});

export default function CursorLayer() {
  return <MagneticCursor />;
}