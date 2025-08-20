import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronsRight, ChevronsLeft } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  return (
    <nav className="flex justify-center fixed-bottom opacity-75 mb-10">
      <ul className="flex justify-center items-center space-x-2 mt-5">
        {page > 1 && (
          <li>
            <Link href={`?page=${page - 1}`}>
              <Button variant="ghost" className="cursor-pointer">
                <ChevronsLeft />
              </Button>
            </Link>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => {
          const p = i + 1;
          return (
            <li>
              <Link href={`?page=${p}`}>
                <Button
                  variant={`${page == p ? "secondary" : "ghost"}`}
                  className="cursor-pointer"
                >
                  {p}
                </Button>
              </Link>
            </li>
          );
        })}

        {page < totalPages && (
          <li>
            <Link href={`?page=${page + 1}`}>
              <Button variant="ghost" className="cursor-pointer">
                <ChevronsRight />
              </Button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
