"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2000,
        // if you have modals/overlays, bump z-index
        style: { zIndex: 999999 },
      }}
    />
  );
}
