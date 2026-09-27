"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}

export function ImageUploadField({ label, file, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFiles = (files: FileList | null) => {
    const selected = files?.[0];
    if (selected && selected.type.startsWith("image/")) onChange(selected);
  };

  return (
    <div>
      <label className="mb-1.5 block px-1 font-sans text-[10px] font-medium tracking-wider text-text-muted uppercase">{label}</label>

      {!file && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => event.key === "Enter" && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={`flex cursor-pointer items-center gap-3 rounded-md border-[1.5px] border-dashed p-3.5 transition-colors ${
            isDragging ? "border-primary/55 bg-primary/6" : "border-primary/30 bg-surface/40 hover:border-primary/55 hover:bg-primary/6"
          }`}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
            <ImagePlus className="h-[22px] w-[22px]" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <div className="font-sans text-[13px] font-medium text-text-primary">Upload image</div>
            <div className="font-sans text-[11px] font-light text-text-secondary/70">Drag &amp; drop or click to browse</div>
          </div>
          <span className="shrink-0 rounded-sm bg-gradient-to-br from-primary-light to-primary px-3.5 py-2 font-sans text-xs font-semibold text-[#03283a]">
            Browse
          </span>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => handleFiles(event.target.files)} />
        </div>
      )}

      {file && previewUrl && (
        <div className="flex items-center gap-3 rounded-md border border-success/32 bg-success/6 px-3.5 py-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- transient client-side object URL, not an optimizable remote/static asset */}
          <img src={previewUrl} alt="" className="h-12 w-12 shrink-0 rounded-md border-2 border-success/50 object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-sans text-[13px] font-medium text-text-primary">{file.name}</div>
            <div className="font-sans text-[11px] font-light text-text-secondary/70">{Math.round(file.size / 1024)} KB</div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-danger/30 bg-danger/12 text-danger transition hover:bg-danger/20"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
