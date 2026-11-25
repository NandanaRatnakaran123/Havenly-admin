"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_DIMENSION = 1280;

/** Reads an image file and shrinks it to a JPEG data URL (max 1280px), so stored values stay small. */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read the image"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("That file is not a readable image"));
    };
    img.src = objectUrl;
  });
}

interface ImageFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

/** Choose a file or paste an image URL, with a live preview. Value is a URL or a data URL. */
export function ImageField({ id, value, onChange }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [broken, setBroken] = useState(false);
  const isUpload = value.startsWith("data:");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choose an image file (JPG, PNG, WebP).");
    if (file.size > MAX_FILE_BYTES) return setError("Image must be under 8 MB.");
    try {
      setError(undefined);
      setBroken(false);
      onChange(await fileToDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read the image");
    }
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="sr-only"
            aria-label="Choose image file"
            tabIndex={-1}
          />
          <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" aria-hidden /> Choose file
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onChange("");
                setError(undefined);
                setBroken(false);
              }}
            >
              <X className="h-4 w-4" aria-hidden /> Remove
            </Button>
          )}
          <span className="text-xs text-slate-500">or paste a link below</span>
        </div>
        <Input
          id={id}
          type="url"
          placeholder="https://..."
          value={isUpload ? "" : value}
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
        />
        {isUpload && <p className="text-xs text-slate-500">Using the uploaded file.</p>}
        {error && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        {!value ? (
          <p className="p-6 text-center text-sm text-slate-500">Photo preview appears here</p>
        ) : broken ? (
          <p className="p-6 text-center text-sm text-red-600">Could not load this image.</p>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Property photo preview"
            onError={() => setBroken(true)}
            className="max-h-64 w-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
