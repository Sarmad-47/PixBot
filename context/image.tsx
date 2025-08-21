"use client";
import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { generateImageAi } from "@/actions/image";
import { getUserCreditsFromDb, checkCreditRecordDb } from "@/actions/credit";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { get } from "http";

interface ImageType {
  imageUrl: string;
}

interface ImageContextType {
  imagePrompt: string;
  setImagePrompt: (query: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  generateImage: () => void;
  credits: number;
  setCredits: React.Dispatch<React.SetStateAction<number>>;
  getUserCredits: () => void;
}

const ImageContext = React.createContext<ImageContextType | undefined>(
  undefined
);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  // state
  const [imagePrompt, setImagePrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    getUserCredits();
  }, []);

  useEffect(() => {
    checkCreditRecordDb();
  }, []);

  const getUserCredits = async () => {
    getUserCreditsFromDb().then((credit) => setCredits(credit?.credits));
  };

  // functions
  const generateImage = async () => {
    // Prevent generation if prompt is empty
    if (!imagePrompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);

    if (!isSignedIn) {
      toast.error("Please sign in to generate image");
      setLoading(false);
      return;
    }

    try {
      // generate image with ai
      const { success, _id, credits } = await generateImageAi(imagePrompt);
      if (success) {
        setCredits(credits);
        setImagePrompt(""); // Clear the prompt after successful generation
        toast.success("🎉 Image generated");
        router.push(`/dashboard/image/${_id}`);
      } else {
        setCredits(credits);
        toast.error(
          "Insufficient credits. Please buy more credits to generate images"
        );
        router.push("/buy-credits");
      }
    } catch (err) {
      toast.error("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        imagePrompt,
        setImagePrompt,
        loading,
        setLoading,
        generateImage,
        credits,
        setCredits,
        getUserCredits,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = React.useContext(ImageContext);
  if (context == undefined) {
    throw new Error("useImage must be used within a ImageProvider");
  }
  return context;
};
