"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWithdrawals, submitWithdrawalRequest } from "@/store/slices/withdrawalsSlice";
import { toast } from "@/lib/utils/toast";
import type {
  Withdrawal,
  WithdrawalRequestInput,
  WithdrawalStatusFilter,
  WithdrawalsSort,
} from "@/features/withdrawals/types/withdrawals.types";

function sortRows(rows: Withdrawal[], sort: WithdrawalsSort): Withdrawal[] {
  const sorted = [...rows];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "oldest":
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case "highest":
      return sorted.sort((a, b) => b.amountCoins - a.amountCoins);
    case "lowest":
      return sorted.sort((a, b) => a.amountCoins - b.amountCoins);
  }
}

export function useWithdrawals() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { withdrawals, truncated, status, error, submitting } = useAppSelector((state) => state.withdrawals);

  const [statusFilter, setStatusFilter] = useState<WithdrawalStatusFilter>("all");
  const [sort, setSort] = useState<WithdrawalsSort>("newest");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user || status !== "idle") return;
    void dispatch(fetchWithdrawals());
  }, [dispatch, user, status]);

  const refresh = useCallback(() => {
    void dispatch(fetchWithdrawals());
  }, [dispatch]);

  const submit = useCallback(
    async (input: WithdrawalRequestInput) => {
      const result = await dispatch(submitWithdrawalRequest(input));
      if (submitWithdrawalRequest.fulfilled.match(result)) {
        toast.success("Withdrawal request submitted.");
        return true;
      }
      return false;
    },
    [dispatch],
  );

  const derived = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const filtered = withdrawals.filter((row) => {
      if (statusFilter === "pending" && row.approved) return false;
      if (statusFilter === "approved" && !row.approved) return false;
      if (
        trimmed &&
        !(row.paymentDetail ?? "").toLowerCase().includes(trimmed) &&
        !(row.paymentType ?? "").toLowerCase().includes(trimmed) &&
        !String(row.amountCoins).includes(trimmed)
      ) {
        return false;
      }
      return true;
    });

    const approvedRows = withdrawals.filter((row) => row.approved);
    const pendingRows = withdrawals.filter((row) => !row.approved);

    return {
      rows: sortRows(filtered, sort),
      counts: {
        all: withdrawals.length,
        approved: approvedRows.length,
        pending: pendingRows.length,
      },
      totals: {
        requested: withdrawals.reduce((sum, row) => sum + row.amountCoins, 0),
        approved: approvedRows.reduce((sum, row) => sum + row.amountCoins, 0),
        pending: pendingRows.reduce((sum, row) => sum + row.amountCoins, 0),
      },
    };
  }, [withdrawals, statusFilter, sort, query]);

  return {
    user,
    status,
    error,
    truncated,
    submitting,
    refresh,
    submit,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    query,
    setQuery,
    hasAny: withdrawals.length > 0,
    ...derived,
  };
}
