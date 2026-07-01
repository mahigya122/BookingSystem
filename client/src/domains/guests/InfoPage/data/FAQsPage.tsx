import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const FAQ_ITEMS = [
  {
    q: "How do I book?",
    a: "Select your dates, cabin, and guests, then follow our 3-step secure checkout process.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Most cabins offer a full refund up to 7 days before check-in. Specific policies are listed on each cabin page.",
  },
  {
    q: "Are pets allowed?",
    a: "Many of our forest cabins are pet-friendly. Look for the 'Pet Friendly' tag in the filters.",
  },
];

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common inquiries."
      icon={HelpCircle}
    >
      <div className="space-y-4 not-prose">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.q}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                  {item.q}
                </span>
                <Plus
                  size={20}
                  className={`shrink-0 text-sky-500 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
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
