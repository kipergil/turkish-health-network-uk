"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * A large profile photo with a real next/image optimisation path (resizing,
 * format conversion, lazy loading), unlike the small Avatar/AvatarImage
 * thumbnails used on list cards — those stay on Radix's plain <img> since a
 * 32–48px circle gets negligible benefit from the image pipeline and Radix
 * already handles broken-image fallback for free. This component
 * replicates that same graceful fallback (hide the photo, show initials)
 * manually, since next/image doesn't do that on its own.
 */
export function ProfilePhoto({
  src,
  alt,
  initials,
  sizePx = 80,
  className,
}: {
  src?: string;
  alt: string;
  initials: string;
  sizePx?: number;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "bg-muted text-foreground flex shrink-0 items-center justify-center rounded-full font-medium",
          className,
        )}
        style={{ width: sizePx, height: sizePx }}
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={sizePx}
      height={sizePx}
      className={cn("shrink-0 rounded-full object-cover", className)}
      onError={() => setErrored(true)}
    />
  );
}
