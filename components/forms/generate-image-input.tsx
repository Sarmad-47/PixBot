"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image";
import { Loader2Icon } from "lucide-react";

export default function GenerateImageInput() {
  const { generateImage, imagePrompt, setImagePrompt, loading } = useImage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePrompt.trim() && !loading) {
      generateImage();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-5 flex space-x-2">
        <Input
          placeholder="mountain lookout"
          value={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          className="p-6 lg:p-8 text-lg lg:text-2xl"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !imagePrompt.trim()}
          className="p-6 lg:p-8 text-lg lg:text-2xl cursor-pointer disabled:cursor-not-allowed"
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
