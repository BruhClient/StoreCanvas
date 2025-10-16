// components/FlexImage.tsx
import Image from "next/image";
import React from "react";

interface FlexImageProps {
  src?: string | null;
  alt: string;
  width?: number | string; // e.g. 150 or "100%"
  height?: number | string; // e.g. 150 or "auto"
  rounded?: string; // e.g. "md", "lg", "full"
  className?: string;
  aspectRatio?: string; // e.g. "1/1" or "16/9"
}

export default function FlexImage({
  src,
  alt,
  width = 150,
  height = 150,
  rounded = "md",
  className = "",
  aspectRatio,
}: FlexImageProps) {
  const imageSrc = src && src.length > 0 ? src : "/placeholder-image.png";

  return (
    <div
      className={`relative overflow-hidden rounded-${rounded} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        aspectRatio,
      }}
    >
      <Image src={imageSrc} alt={alt} fill className="object-cover" />
    </div>
  );
}
