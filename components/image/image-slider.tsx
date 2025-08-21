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
  alt?: string;
  createdAt: string;
  userName?: string;
  name?: string;
}

export default function ImageSlider({ images }: { images: ImageType[] }) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let scrollSpeed = 1;

    const scroll = () => {
      if (!isHovering && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isHovering]);

  const handleImageClick = (image: ImageType) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  const handleImageLoad = (imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  };

  const getAltText = (image: ImageType): string => {
    if (image.alt?.trim()) return image.alt;
    if (image.name?.trim()) return `AI generated image: ${image.name}`;
    if (image.userName) return `AI image created by ${image.userName}`;
    return "AI generated image";
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide py-4"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ whiteSpace: "nowrap" }}
      >
        {images.concat(images).map((image, index) => (
          <div
            key={`${image._id}-${index}`}
            className="shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={() => handleImageClick(image)}
            style={{ display: "inline-block" }}
          >
            <div className="relative">
              <Image
                src={image.url}
                alt={getAltText(image)}
                width={200}
                height={200}
                className="rounded-lg object-cover shadow-lg"
                priority={index < 6} // Prioritize loading first few images
                onLoad={() => handleImageLoad(image._id)}
              />
              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                <p className="text-[8px] text-white bg-black bg-opacity-70 px-2 py-1 rounded">
                  {dayjs(image.createdAt).fromNow()} by{" "}
                  {image?.userName || "Anonymous"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-none">
          {selectedImage && (
            <div className="flex items-center justify-center p-4">
              <Image
                src={selectedImage.url}
                alt={getAltText(selectedImage)}
                width={800}
                height={600}
                className="rounded-lg object-contain max-h-[80vh] max-w-full"
                priority
              />
              <p className="absolute bottom-4 left-4 text-sm text-white bg-black bg-opacity-70 px-3 py-1 rounded">
                Created {dayjs(selectedImage.createdAt).fromNow()} by{" "}
                {selectedImage?.userName || "Anonymous"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
