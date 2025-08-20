"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ImageType {
  _id: string;
  url: string;
  alt?: string; // Made optional with ?
  createdAt: string;
  userName?: string;
  name?: string; // Added name as a fallback
}

export default function ImageSlider({ images }: { images: ImageType[] }) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!isHovering) {
        // Scroll incrementally
        scrollContainer.scrollLeft += 1; // Adjust speed as needed

        // Check if we've reached the end of the scroll area
        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          // Reset scroll back to the start
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Start the scroll animation
    animationFrameId = requestAnimationFrame(scroll);

    // Clean up the animation frame on component unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovering]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const handleImageLoad = (width: number, height: number) => {
    setImageDimensions({ width, height });
  };

  // Function to generate a proper alt text
  const getAltText = (image: ImageType): string => {
    if (image.alt && image.alt.trim() !== "") {
      return image.alt;
    }
    if (image.name && image.name.trim() !== "") {
      return `AI generated image: ${image.name}`;
    }
    if (image.userName) {
      return `AI image created by ${image.userName}`;
    }
    return "AI generated image";
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ whiteSpace: "nowrap" }} // Ensure no line breaks between images
      >
        {images.concat(images).map((image, index) => (
          <div
            key={`${image._id}-${index}`}
            className="shrink-0 cursor-pointer transition-all duration-300 hover:scale-105"
            onClick={() => setSelectedImage(image)}
            style={{ display: "inline-block" }} // Keep each item inline
          >
            <div className="relative">
              <Image
                src={image.url}
                alt={getAltText(image)} // Use the helper function
                width={200} // Set a width that works well for small screens
                height={200}
                className="rounded-lg object-cover shadow-lg"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <p className="text-[8px] text-white bg-black bg-opacity-50 px-1 py-0.5 rounded">
                  {dayjs(image.createdAt).fromNow()} by{" "}
                  {image?.userName || "Anonymous"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent
          className="flex items-center justify-center overflow-hidden"
          style={{
            maxWidth: "90vw", // Limit width to 90vw
            maxHeight: "90vh", // Limit height to 90vh
          }}
        >
          {selectedImage && (
            <div className="relative flex items-center justify-center">
              <Image
                src={selectedImage.url}
                alt={getAltText(selectedImage)} // Use the helper function
                width={imageDimensions.width || 500} // Default width
                height={imageDimensions.height || 500} // Default height
                className="rounded-lg object-contain"
                onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                  handleImageLoad(naturalWidth, naturalHeight)
                }
                style={{
                  maxHeight: "90vh", // Limit image height to 90vh
                  maxWidth: "90vw", // Limit image width to 90vw
                  height: "auto", // Let height adjust based on width
                  width: "auto", // Let width adjust based on height
                }}
              />
              <p className="absolute bottom-8 text-center text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                Created {dayjs(selectedImage.createdAt).fromNow()}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
