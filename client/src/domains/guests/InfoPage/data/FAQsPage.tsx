import { useState } from "react";
import { Plus } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const FAQ_ITEMS = [
  {
    q: "How do I book a cabin?",
    a: "Browse or search on the Explore page, pick your dates and guest count, and follow the checkout flow. You'll get a confirmation email the moment payment clears.",
  },
  {
    q: "What's the cancellation policy?",
    a: "Most cabins offer a full refund up to 7 days before check-in. Each listing shows its exact policy before you book, and it's also visible in My Bookings afterward.",
  },
  {
    q: "Are pets allowed?",
    a: "Many of our cabins are pet-friendly — look for the 'Pet Friendly' filter on the Explore page, or check the amenities list on the cabin's own page.",
  },
  {
    q: "How do I contact my host?",
    a: "Once a booking is confirmed, a conversation with your host opens automatically under Messages, with read receipts and typing indicators so you know when they've seen it.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes — all payments are processed through our encrypted checkout, and we never store your card details on our own servers.",
  },
];

const FAQsPage = () => {
  const isLoading = useSimulatedLoad();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="FAQs"
      title="Frequently asked questions"
      subtitle="Quick answers on booking, payments, and staying in touch with your host."
    >
      <div className="space-y-3 not-prose">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.q}
              className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                  {item.q}
                </span>
                <Plus
                  size={18}
                  className={`shrink-0 text-sky-500 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </InfoPageLayout>
  );
};

export default FAQsPage;
