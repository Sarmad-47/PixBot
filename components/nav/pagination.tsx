"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageClick = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center mb-10">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => handlePageClick(page - 1)}
          disabled={page <= 1}
          className="cursor-pointer"
        >
          <ChevronsLeft />
        </Button>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNumber: number;

          // Show first pages, current page, and last pages
          if (totalPages <= 7) {
            pageNumber = i + 1;
          } else if (page <= 4) {
            pageNumber = i + 1;
            if (i === 6) pageNumber = totalPages; // Last button
            else if (i === 5)
              return (
                <span key="ellipsis1" className="px-2">
                  ...
                </span>
              );
          } else if (page >= totalPages - 3) {
            if (i === 0) pageNumber = 1; // First button
            else if (i === 1)
              return (
                <span key="ellipsis2" className="px-2">
                  ...
                </span>
              );
            else pageNumber = totalPages - 6 + i;
          } else {
            if (i === 0) pageNumber = 1; // First button
            else if (i === 1)
              return (
                <span key="ellipsis3" className="px-2">
                  ...
                </span>
              );
            else if (i === 5)
              return (
                <span key="ellipsis4" className="px-2">
                  ...
                </span>
              );
            else if (i === 6) pageNumber = totalPages; // Last button
            else pageNumber = page - 2 + i;
          }

          return (
            <Button
              key={pageNumber}
              variant={page === pageNumber ? "secondary" : "ghost"}
              onClick={() => handlePageClick(pageNumber)}
              className="cursor-pointer min-w-[40px]"
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="ghost"
          onClick={() => handlePageClick(page + 1)}
          disabled={page >= totalPages}
          className="cursor-pointer"
        >
          <ChevronsRight />
        </Button>
      </div>
    </nav>
  );
}
