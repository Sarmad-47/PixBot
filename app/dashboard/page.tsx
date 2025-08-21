"use client";

import { useState, useEffect } from "react";
import { getUserImagesFromDb } from "@/actions/image";
import { ImageType } from "@/utils/types/image";
import Link from "next/link";
import ImageCard from "@/components/cards/image-card";
import Pagination from "@/components/nav/pagination";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 6;

  useEffect(() => {
    loadImages(currentPage);
  }, [currentPage]);

  const loadImages = async (page: number) => {
    setLoading(true);
    try {
      const { images: newImages, totalCount } = await getUserImagesFromDb(
        page,
        limit
      );
      setImages(newImages);
      setTotalPages(Math.ceil(totalCount / limit));
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Optional: Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <div className="p-5 text-center">
        <h1 className="text-2xl font-bold">Images</h1>
        <p>Your AI-Generated Image Collection</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {images.map((image: ImageType) => (
              <Link
                key={image._id}
                href={`/dashboard/image/${image._id}`}
                prefetch={false} // Disable prefetch for better performance
              >
                <ImageCard image={image} />
              </Link>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No images found. Generate your first image!
              </p>
            </div>
          )}

          <div className="flex justify-center m-20">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
