import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import type { CheckoutKind, CheckoutOutcome, CheckoutReceipt } from "@/features/checkout/types/checkout.types";

interface CheckoutResultStepProps {
  kind: CheckoutKind | null;
  outcome: CheckoutOutcome;
  receipt: CheckoutReceipt | null;
  onRetry: () => void;
  onChangeMethod: () => void;
}

export function CheckoutResultStep({ kind, outcome, receipt, onRetry, onChangeMethod }: CheckoutResultStepProps) {
  if (outcome === "failed" || !receipt) {
    return (
      <div className="rounded-[20px] border border-danger/26 bg-surface/50 p-8 text-center">
        <XCircle className="mx-auto h-14 w-14 text-danger" aria-hidden="true" />
        <h2 className="mt-4 font-display text-[24px] font-semibold text-text-primary">Payment Failed</h2>
        <p className="mx-auto mt-1.5 max-w-[380px] font-sans text-[13px] leading-relaxed font-light text-text-secondary">
          The payment couldn&apos;t be completed. No amount has been charged.
        </p>
        <div className="mt-6 flex justify-center gap-2.5">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
          >
            Retry Payment
          </button>
          <button
            type="button"
            onClick={onChangeMethod}
            className="rounded-md border border-primary/18 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
          >
            Change Method
          </button>
        </div>
      </div>
    );
  }

  const receiptRows = [
    { key: "txn", label: "Transaction ID", value: receipt.transactionId },
    { key: "gateway", label: "Payment Gateway", value: receipt.gatewayLabel },
    { key: "item", label: kind === "coins" ? "Coins Purchased" : "Package", value: receipt.itemLabel },
    ...(receipt.promoCode
      ? [{ key: "promo", label: "Promo Code", value: `${receipt.promoCode.toUpperCase()} (−$${receipt.discount.toFixed(2)})` }]
      : []),
    { key: "amount", label: "Amount Paid", value: `$${receipt.amountPaid.toFixed(2)}` },
    { key: "status", label: "Status", value: "Completed" },
  ];

  return (
    <div className="rounded-[20px] border border-success/26 bg-surface/50 p-8">
      <div className="text-center">
        <span className="relative mx-auto inline-flex">
          <span className="absolute inset-0 animate-ping rounded-full bg-success/20" />
          <CheckCircle2 className="relative h-14 w-14 text-success" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-[24px] font-semibold text-text-primary">Payment Successful!</h2>
        <p className="mt-1 font-sans text-[13px] font-light text-text-secondary">
          {kind === "coins"
            ? "Your coins have been added to your wallet."
            : "Your subscription is now active — enjoy the exclusive content."}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-primary/12 bg-surface-elevated/30 p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-sans text-[10.5px] font-semibold tracking-wide text-text-secondary/60 uppercase">
            Payment Receipt
          </span>
          <span className="rounded-full bg-success/16 px-2.5 py-0.5 font-sans text-[9.5px] font-bold tracking-wide text-success uppercase">
            Paid
          </span>
        </div>
        <div className="flex flex-col gap-2 font-sans text-[12.5px]">
          {receiptRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-3">
              <span className="text-text-secondary/70">{row.label}</span>
              <span className="truncate font-medium text-text-primary">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Link
          href={ROUTES.HOME}
          className="rounded-md border border-primary/18 bg-surface/60 px-5 py-2.5 font-sans text-[13px] font-medium text-text-secondary transition hover:bg-primary/10"
        >
          Go to Home
        </Link>
        <Link
          href={kind === "coins" ? ROUTES.WALLET : ROUTES.SUBSCRIPTIONS}
          className="rounded-md bg-gradient-to-br from-primary-light to-primary px-5 py-2.5 font-sans text-[13px] font-semibold text-[#03283a] shadow-glow transition hover:-translate-y-0.5"
        >
          {kind === "coins" ? "Go to Wallet" : "View Subscription"}
        </Link>
      </div>
    </div>
  );
}
