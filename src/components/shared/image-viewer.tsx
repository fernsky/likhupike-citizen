"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ImageViewerProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export function ImageViewer({
  isOpen,
  imageUrl,
  title,
  onClose,
}: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.5);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.5);
    }
  };

  const handleDialogClose = () => {
    // Reset zoom level when closing
    setZoomLevel(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title || "Document Image"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-hidden relative">
          <div
            className="flex justify-center items-center transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Using regular img instead of next/image for better zooming control */}
            <Image
              src={imageUrl}
              alt={title || "Document"}
              className="max-w-full max-h-[70vh] object-contain"
              width={1200}
              height={1200}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
