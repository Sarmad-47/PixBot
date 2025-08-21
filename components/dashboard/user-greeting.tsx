"use client";

import { useUser } from "@clerk/nextjs";

export default function UserGreeting() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <p className="mt-8 text-sm sm:text-base">Loading...</p>;
  }

  return (
    <p className="mt-8 text-sm sm:text-base">
      {isSignedIn
        ? "What image are you generating today?"
        : "Sign in now and get 5 free image generation credits"}
    </p>
  );
}
