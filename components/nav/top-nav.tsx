"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { LaptopMinimal, Bot, LogIn, LucideIcon } from "lucide-react";
import ModeToggle from "./mode-toggle";
import Credits from "./credits";

interface IconWithTextProps {
  href: string;
  icon: LucideIcon;
  text: string;
}

const IconWithText: React.FC<IconWithTextProps> = ({
  href,
  icon: Icon,
  text,
}) => (
  <Link href={href}>
    <div className="flex flex-col items-center cursor-pointer">
      <Icon className="h-10 w-10 text-[#6a5acd]" />
      <span className="text-xs text-gray-500 mt-1 cursor-pointer">{text}</span>
    </div>
  </Link>
);

export default function TopNav() {
  const { isSignedIn } = useUser(); // Client-side user check

  return (
    <div className="flex items-center justify-center space-x-10 p-5 shadow !overflow-x-hidden !overflow-y-hidden">
      <div className="flex items-center overflow-x-auto space-x-4 md:space-x-10">
        <div className="flex flex-col items-center cursor-pointer">
          <Link href="/">
            <Image
              src="/logos/logo.svg"
              alt="ai image generator logo"
              width={50}
              height={50}
            />
          </Link>
          <span className="text-xs text-gray-500 mt-1 cursor-pointer hidden sm:inline-block">
            Pixbot
          </span>
        </div>

        {/* Show dashboard link based on if user is logged in */}
        {isSignedIn && (
          <IconWithText
            href="/dashboard"
            icon={LaptopMinimal}
            text="Dashboard"
          />
        )}

        <IconWithText href="/chat" icon={Bot} text="Chat" />

        {/* Show credits link only if user is logged in */}
        {isSignedIn && (
          <div className="flex flex-col items-center cursor-pointer">
            <Link href="/buy-credits">
              <Credits />
            </Link>
            <span className="text-xs text-gray-500 mt-1 cursor-pointer">
              Credits
            </span>
          </div>
        )}

        <div className="flex flex-col items-center cursor-pointer">
          <SignedOut>
            <SignInButton>
              <LogIn className="h-9 w-9 text-[#6a5acd] cursor-pointer" />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center h-10 w-10">
              <UserButton />
            </div>
          </SignedIn>
          <span className="text-xs text-gray-500 mt-1 cursor-pointer">
            Account
          </span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <ModeToggle />
          <span className="text-xs text-gray-500 mt-1 cursor-pointer">
            Theme
          </span>
        </div>
      </div>
    </div>
  );
}
