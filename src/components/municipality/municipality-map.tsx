"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MunicipalityMapProps {
  leftLong: number;
  rightLong: number;
  topLat: number;
  bottomLat: number;
  name: string;
}

export function MunicipalityMap({ 
  leftLong, 
  rightLong, 
  topLat, 
  bottomLat,
  name 
}: MunicipalityMapProps) {
  const t = useTranslations();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This is where you would initialize a mapping library like Leaflet
    // For now, we'll create a simple visualization with HTML/CSS
    
    if (!mapContainerRef.current) return;
    
    const container = mapContainerRef.current;
    container.innerHTML = ''; // Clear existing content
    
    // Create a stylized representation
    container.style.position = 'relative';
    container.style.backgroundColor = '#EFF6FF'; // Light blue background
    container.style.overflow = 'hidden';
    
    // Create an approximate territory visualization
    const territory = document.createElement('div');
    territory.style.position = 'absolute';
    territory.style.left = '10%';
    territory.style.top = '10%';
    territory.style.width = '80%';
    territory.style.height = '80%';
    territory.style.backgroundColor = '#3B82F6'; // Blue area
    territory.style.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%'; // Make it organic
    territory.style.opacity = '0.8';
    territory.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
    container.appendChild(territory);
    
    // Add a label
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.left = '50%';
    label.style.top = '50%';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.padding = '8px 12px';
    label.style.backgroundColor = 'white';
    label.style.borderRadius = '4px';
    label.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    label.style.fontWeight = 'bold';
    label.textContent = name;
    container.appendChild(label);
    
    // Add markers for corners
    const createMarker = (x: string, y: string, text: string) => {
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.left = x;
      marker.style.top = y;
      marker.style.width = '8px';
      marker.style.height = '8px';
      marker.style.backgroundColor = '#EF4444'; // Red dot
      marker.style.borderRadius = '50%';
      
      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
      tooltip.style.color = 'white';
      tooltip.style.padding = '4px 8px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.fontSize = '10px';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.opacity = '0';
      tooltip.style.transition = 'opacity 0.2s';
      tooltip.textContent = text;
      
      marker.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });
      marker.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
      
      marker.appendChild(tooltip);
      container.appendChild(marker);
    };
    
    // Add corner markers
    createMarker('10%', '10%', `${topLat.toFixed(2)}°, ${leftLong.toFixed(2)}°`);
    createMarker('90%', '10%', `${topLat.toFixed(2)}°, ${rightLong.toFixed(2)}°`);
    createMarker('10%', '90%', `${bottomLat.toFixed(2)}°, ${leftLong.toFixed(2)}°`);
    createMarker('90%', '90%', `${bottomLat.toFixed(2)}°, ${rightLong.toFixed(2)}°`);
    
    // Add a north indicator
    const north = document.createElement('div');
    north.style.position = 'absolute';
    north.style.right = '10px';
    north.style.top = '10px';
    north.style.width = '30px';
    north.style.height = '30px';
    north.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 10l7-7m0 0l7 7m-7-7v18'%3E%3C/path%3E%3C/svg%3E\")";
    container.appendChild(north);
    
  }, [leftLong, rightLong, topLat, bottomLat, name]);
  
  return (
    <div className="space-y-4">
      {/* Map container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-60 md:h-80 border rounded-md overflow-hidden"
        aria-label={t("municipality.map.ariaLabel", { name })}
      />
      
      {/* Disclaimer */}
      <Alert variant="default" className="text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-xs font-normal">
          {t("municipality.map.note.title")}
        </AlertTitle>
        <AlertDescription className="text-xs">
          {t("municipality.map.note.description")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
