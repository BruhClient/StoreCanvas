"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipRenderProps } from "react-joyride";
import { cn } from "@/lib/utils";

export function CustomTooltip({
  step,
  index,
  size,
  backProps,
  primaryProps,
  skipProps,
  closeProps,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="bg-white shadow-lg rounded-lg p-4 max-w-xs"
    >
      <div className="text-gray-800 text-sm mb-3">{step.content}</div>

      <div
        className={cn(
          "flex justify-between items-center w-full",
          index === 0 ? "justify-end" : "justify-between"
        )}
      >
        {/* Back button */}
        {index > 0 && (
          <Button
            variant="ghost"
            size="icon"
            {...backProps}
            onClick={(e) => {
              e.preventDefault(); // prevent form submit
              backProps.onClick?.(e);
            }}
            className="p-2"
            type="button"
          >
            <ArrowLeft size={16} />
          </Button>
        )}

        <div className="flex gap-2">
          {/* Skip button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            {...skipProps}
            className="text-red-500 p-2"
          >
            <X size={16} />
          </Button>

          {/* Next button */}
          <Button
            variant="ghost"
            size="icon"
            {...primaryProps}
            onClick={(e) => {
              e.preventDefault();
              primaryProps.onClick?.(e);
            }}
            type="button"
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
