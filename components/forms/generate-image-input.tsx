"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image";
import { Loader2Icon } from "lucide-react";

export default function GenerateImageInput() {
  const { generateImage, imagePrompt, setImagePrompt, loading } = useImage();

  return (
    <form onSubmit={generateImage}>
      <div className="mb-5 flex space-x-2">
        <Input
          placeholder="mountain lookout"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          className="p-6 lg:p-8 text-lg lg:text-2xl"
        />
        <Button
          onClick={generateImage}
          disabled={loading}
          className="p-6 lg:p-8 text-lg lg:text-2xl cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2Icon className="animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>Generate Image</>
          )}
        </Button>
      </div>
    </form>
  );
}
