"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * A large profile photo with a real next/image optimisation path (resizing,
 * format conversion, lazy loading), unlike the small Avatar/AvatarImage
 * thumbnails used on list cards — those stay on Radix's plain <img> since a
 * 32–48px circle gets negligible benefit from the image pipeline and Radix
 * already handles broken-image fallback for free. This component
 * replicates that same graceful fallback (hide the photo, show initials)
 * manually, since next/image doesn't do that on its own.
 *
 * Clicking the photo opens the untouched, uncropped source image in a
 * modal — the thumbnail itself uses object-contain rather than -cover so
 * non-square source photos (banners, wide hero crops) don't get a chunk
 * cropped off, but a small circle still can't show much detail.
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
  const [open, setOpen] = useState(false);

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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-visible:ring-ring/50 shrink-0 cursor-zoom-in rounded-full focus-visible:ring-3 focus-visible:outline-none"
        aria-label={`View full-size photo${alt ? ` — ${alt}` : ""}`}
      >
        <Image
          src={src}
          alt={alt}
          width={sizePx}
          height={sizePx}
          className={cn("bg-muted rounded-full object-contain", className)}
          onError={() => setErrored(true)}
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-w-[calc(100%-2rem)] justify-center p-2 sm:max-w-2xl">
          <DialogTitle className="sr-only">{alt || "Photo"}</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element -- one-off full-size view of the source image; not worth routing through the image pipeline */}
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
