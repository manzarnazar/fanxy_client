"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CameraPreviewState {
  status: "requesting" | "ready" | "denied";
  cameraLabel: string | null;
  micLabel: string | null;
}

/**
 * Real device preview for the pre-live screen via getUserMedia — the tracks
 * are stopped before handing the devices over to the Zego stage.
 */
export function useCameraPreview(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraPreviewState>({
    status: "requesting",
    cameraLabel: null,
    micLabel: null,
  });
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const stopPreview = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (!active) {
      stopPreview();
      return;
    }

    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setState({
          status: "ready",
          cameraLabel: stream.getVideoTracks()[0]?.label ?? null,
          micLabel: stream.getAudioTracks()[0]?.label ?? null,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "denied", cameraLabel: null, micLabel: null });
      });

    return () => {
      cancelled = true;
      stopPreview();
    };
  }, [active, stopPreview]);

  const toggleCamera = useCallback(() => {
    const next = !cameraOn;
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });
    setCameraOn(next);
  }, [cameraOn]);

  const toggleMic = useCallback(() => {
    const next = !micOn;
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
    setMicOn(next);
  }, [micOn]);

  return {
    videoRef,
    status: state.status,
    cameraLabel: state.cameraLabel,
    micLabel: state.micLabel,
    cameraOn,
    micOn,
    toggleCamera,
    toggleMic,
    stopPreview,
  };
}
