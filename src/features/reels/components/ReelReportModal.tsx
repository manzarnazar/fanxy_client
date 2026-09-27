"use client";

import { ReportModal } from "@/components/shared/ReportModal";
import { useAppDispatch } from "@/store/hooks";
import { reportReel } from "@/store/slices/reelsSlice";
import { useReportReasons } from "@/hooks/useReportReasons";
import { REPORT_REASONS } from "@/features/reels/constants/reels";

interface ReelReportModalProps {
  reelId: string;
  open: boolean;
  onClose: () => void;
}

export function ReelReportModal({ reelId, open, onClose }: ReelReportModalProps) {
  const dispatch = useAppDispatch();
  const reasons = useReportReasons(REPORT_REASONS);

  return (
    <ReportModal
      title="Report reel"
      reasons={reasons}
      open={open}
      onClose={onClose}
      onSubmit={(reason) => dispatch(reportReel({ reelId, reason })).unwrap().then(() => undefined)}
    />
  );
}
