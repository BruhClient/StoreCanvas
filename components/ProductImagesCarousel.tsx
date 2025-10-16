"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface ProductImagesCarouselProps {
  images: string[];
  visibleOnHover?: boolean;
  height?: string; // e.g. "h-[250px]" or "h-[300px]"
}

const ProductImagesCarousel = ({
  images,
  visibleOnHover = true,
  height = "h-[250px]",
}: ProductImagesCarouselProps) => {
  const displayImages = images.length > 0 ? images : ["/placeholder-image.png"];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        height,
        visibleOnHover && "group"
      )}
    >
      {displayImages.length > 1 ? (
        <Carousel className="w-full h-full">
          <CarouselContent>
            {displayImages.map((img, index) => (
              <CarouselItem
                key={index}
                className={cn("relative w-full", height)}
              >
                <Image
                  src={img}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Left Chevron */}
          <CarouselPrevious
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 rounded-lg bg-transparent",
              "transition-opacity text-gray-400 hover:text-gray-200 drop-shadow",
              visibleOnHover
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-90",
              "[&[disabled]]:hidden"
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </CarouselPrevious>

          {/* Right Chevron */}
          <CarouselNext
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 rounded-lg bg-transparent",
              "transition-opacity text-gray-400 hover:text-gray-200 drop-shadow",
              visibleOnHover
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-90",
              "[&[disabled]]:hidden"
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </CarouselNext>
        </Carousel>
      ) : (
        <Image
          src={displayImages[0]}
          alt="Product image"
          fill
          className="object-cover"
        />
      )}
    </div>
  );
};

export default ProductImagesCarousel;
