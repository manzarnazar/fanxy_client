"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, CameraOff, Coins, Gift, Loader2, Mic, MicOff, Radio, VideoOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCount } from "@/lib/formatter/count";
import { useCameraPreview } from "@/features/go-live/hooks/useCameraPreview";
import type { LiveGift } from "@/features/go-live/types/go-live.types";

interface GoLiveSetupProps {
  gifts: LiveGift[];
  starting: boolean;
  liveConfigured: boolean;
  onStart: () => void;
}

export function GoLiveSetup({ gifts, starting, liveConfigured, onStart }: GoLiveSetupProps) {
  const { videoRef, status, cameraLabel, micLabel, cameraOn, micOn, toggleCamera, toggleMic, stopPreview } =
    useCameraPreview(true);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deviceCards = [
    {
      key: "camera",
      icon: cameraOn ? Camera : CameraOff,
      label: "Camera",
      value: status === "denied" ? "Permission denied" : (cameraLabel ?? "Detecting…"),
      ok: status === "ready" && cameraOn,
    },
    {
      key: "mic",
      icon: micOn ? Mic : MicOff,
      label: "Microphone",
      value: status === "denied" ? "Permission denied" : (micLabel ?? "Detecting…"),
      ok: status === "ready" && micOn,
    },
  ];

  const handleStart = () => {
    // Free the devices so the Zego stage can claim them.
    stopPreview();
    setConfirmOpen(false);
    onStart();
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
      {/* Camera preview */}
      <div>
        <div className="relative aspect-video overflow-hidden rounded-[20px] border border-primary/16 bg-surface">
          {status === "denied" ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <VideoOff className="h-9 w-9 text-text-secondary/50" aria-hidden="true" />
              <p className="font-sans text-[13.5px] font-medium text-text-primary">Camera unavailable</p>
              <p className="max-w-[280px] font-sans text-[11.5px] font-light text-text-secondary/70">
                Allow camera and microphone access in your browser to preview and go live.
              </p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
              {!cameraOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface">
                  <CameraOff className="h-9 w-9 text-text-secondary/50" aria-hidden="true" />
                  <p className="font-sans text-[12.5px] font-light text-text-secondary/70">Camera is off</p>
                </div>
              )}
              <span className="absolute top-3.5 left-3.5 rounded-full border border-primary/24 bg-black/45 px-3 py-1 font-sans text-[10.5px] font-semibold text-primary-light backdrop-blur-sm">
                Preview · {status === "ready" ? "Ready to go live" : "Starting camera…"}
              </span>
            </>
          )}
        </div>

        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={toggleMic}
            disabled={status !== "ready"}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3.5 py-2 font-sans text-[12.5px] font-medium transition disabled:opacity-50",
              micOn
                ? "border-primary/16 bg-surface/60 text-text-secondary hover:bg-primary/10"
                : "border-danger/26 bg-danger/10 text-danger",
            )}
          >
            {micOn ? <Mic className="h-4 w-4" aria-hidden="true" /> : <MicOff className="h-4 w-4" aria-hidden="true" />}
            {micOn ? "Mic on" : "Mic muted"}
          </button>
          <button
            type="button"
            onClick={toggleCamera}
            disabled={status !== "ready"}
            className={cn(
              "flex items-center gap-1.5 rounded-md border px-3.5 py-2 font-sans text-[12.5px] font-medium transition disabled:opacity-50",
              cameraOn
                ? "border-primary/16 bg-surface/60 text-text-secondary hover:bg-primary/10"
                : "border-danger/26 bg-danger/10 text-danger",
            )}
          >
            {cameraOn ? <Camera className="h-4 w-4" aria-hidden="true" /> : <CameraOff className="h-4 w-4" aria-hidden="true" />}
            {cameraOn ? "Camera on" : "Camera off"}
          </button>
        </div>

        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          {deviceCards.map((device) => (
            <div key={device.key} className="flex items-center gap-2.5 rounded-xl border border-primary/12 bg-surface/50 px-3.5 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary-light">
                <device.icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-sans text-[12.5px] font-semibold text-text-primary">{device.label}</div>
                <div className="truncate font-sans text-[10.5px] font-light text-text-secondary/65">{device.value}</div>
              </div>
              <span className={cn("h-2 w-2 shrink-0 rounded-full", device.ok ? "bg-success" : "bg-warning")} />
            </div>
          ))}
        </div>
      </div>

      {/* Right column: gifts + start */}
      <div className="flex flex-col gap-4">
        {gifts.length > 0 && (
          <div className="rounded-[20px] border border-primary/14 bg-surface/50 p-4.5">
            <div className="mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4 text-secondary-light" aria-hidden="true" />
              <span className="font-display text-base font-semibold text-text-primary">Gifts fans can send</span>
            </div>
            <div className="grid max-h-[260px] grid-cols-3 gap-2 overflow-y-auto">
              {gifts.map((gift) => (
                <div key={gift.id} className="flex flex-col items-center gap-1 rounded-xl border border-primary/10 bg-surface-elevated/40 p-2.5">
                  {gift.imageUrl ? (
                    <Image src={gift.imageUrl} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
                  ) : (
                    <Gift className="h-8 w-8 text-secondary-light" aria-hidden="true" />
                  )}
                  <span className="w-full truncate text-center font-sans text-[10.5px] font-medium text-text-primary">{gift.name}</span>
                  <span className="flex items-center gap-0.5 font-sans text-[10px] font-semibold text-warning">
                    <Coins className="h-3 w-3" aria-hidden="true" />
                    {formatCount(gift.coins)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!liveConfigured && (
          <p className="rounded-md border border-warning/24 bg-warning/10 px-3.5 py-2.5 font-sans text-[12px] text-warning">
            Live streaming isn&apos;t configured for this server yet (missing ZegoCloud keys in general settings).
          </p>
        )}

        <button
          type="button"
          disabled={!liveConfigured || starting}
          onClick={() => setConfirmOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-5 py-4 font-sans text-[15px] font-semibold text-white shadow-[0_16px_32px_-14px_rgba(226,29,91,.8)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50"
        >
          {starting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Radio className="h-5 w-5" aria-hidden="true" />}
          Start Live Streaming
        </button>
        <p className="text-center font-sans text-[11px] font-light text-text-secondary/60">
          Your stream appears in the Live tab for fans the moment you start.
        </p>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[96] flex items-center justify-center bg-black/65 p-4 backdrop-blur-[4px]" onClick={() => setConfirmOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Go live confirmation"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-[380px] rounded-xl border border-primary/24 bg-surface-elevated p-6 text-center shadow-dropdown"
          >
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/14 text-secondary-light">
              <Radio className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="font-display text-lg font-semibold text-text-primary">Ready to go live?</div>
            <p className="mt-1.5 font-sans text-[12.5px] leading-relaxed font-light text-text-secondary">
              Your stream will begin immediately and show up for fans in the Live tab.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-md border border-primary/18 bg-surface/60 px-4 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStart}
                className="flex-1 rounded-md bg-gradient-to-br from-secondary-light to-secondary-dark px-4 py-2.5 font-sans text-[13px] font-semibold text-white transition hover:-translate-y-0.5"
              >
                Go Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
