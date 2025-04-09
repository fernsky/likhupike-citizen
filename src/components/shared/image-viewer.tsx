"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Maximize2,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("common");
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset zoom and rotation when dialog opens/closes or image changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  // Handle zoom in
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 4));
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  // Handle zoom using slider
  const handleZoomSlider = (value: number[]) => {
    setZoom(value[0]);
  };

  // Handle rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = title || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default view
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse down event for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Mouse move event for panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  // Mouse up event for panning
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Check for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-black border-gray-800"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{title || "Image Viewer"}</DialogTitle>

        {/* Toolbar */}
        <div className="bg-gray-900 text-white p-3 flex items-center justify-between border-b border-gray-800">
          <div className="font-medium truncate max-w-[70%]">{title}</div>

          <div className="flex items-center gap-1">
            {/* Controls for desktop */}
            <div className="hidden md:flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="w-28 px-2">
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={4}
                  step={0.1}
                  onValueChange={handleZoomSlider}
                  className="w-full"
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Zoom In</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={handleRotate}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rotate</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={toggleFullscreen}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={handleReset}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white hover:bg-gray-700"
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Image container */}
        <div
          className="flex items-center justify-center bg-black h-[calc(95vh-4rem)] overflow-hidden"
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isDragging ? "grabbing" : zoom > 1 ? "grab" : "default",
          }}
        >
          <div
            className="transition-transform"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.2s ease",
            }}
          >
            <Image
              src={imageUrl}
              alt={title || "Image"}
              width={1200}
              height={800}
              className="max-h-[80vh] w-auto object-contain"
              unoptimized // To prevent blurriness at high zoom levels
              quality={100}
              priority
            />
          </div>

          {/* Mobile zoom controls overlay */}
          <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-black/70 rounded-full flex items-center p-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>

              <div className="w-28 px-2">
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={4}
                  step={0.1}
                  onValueChange={handleZoomSlider}
                  className="w-full"
                />
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Help hint */}
          {zoom > 1 && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs p-2 rounded flex items-center">
              <HelpCircle className="h-3 w-3 mr-1" />
              {t("imageViewer.dragToMove")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
