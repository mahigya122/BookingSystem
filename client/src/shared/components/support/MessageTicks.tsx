import type { SupportMessage, TickStatus } from "@shared/types/support.types";

export function getTickStatus(msg: SupportMessage): TickStatus {
  if (msg.seen_at) return "seen";
  if (msg.delivered_at) return "delivered";
  return "sent";
}

export function MessageTicks({ status }: { status: TickStatus }) {
  const color = status === "seen" ? "text-sky-400" : "text-slate-300";

  if (status === "sent") {
    return (
      <span className={`inline-flex items-center ml-1 ${color}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M1 5l3 3 5-7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  // delivered = grey double tick, seen = blue double tick — same shape, different color
  return (
    <span className={`inline-flex items-center ml-1 ${color}`}>
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path
          d="M1 5l3 3 5-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 5l3 3 5-7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
