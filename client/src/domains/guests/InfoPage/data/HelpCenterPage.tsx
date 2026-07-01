import { Calendar, MessageCircle, ShieldQuestion, Wallet } from "lucide-react";
import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const TOPICS = [
  {
    icon: Calendar,
    title: "Booking & Dates",
    desc: "Changing dates, understanding availability, and what happens at checkout.",
  },
  {
    icon: Wallet,
    title: "Payments & Refunds",
    desc: "How charges work, when refunds land, and reading a cancellation policy.",
  },
  {
    icon: MessageCircle,
    title: "Messaging a Host",
    desc: "Reaching your host before and during a stay through Guest Messages.",
  },
  {
    icon: ShieldQuestion,
    title: "Trust & Safety",
    desc: "How listings are verified and what to do if something looks off.",
  },
];

const HelpCenterPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Help Center"
      title="What can we help with?"
      subtitle="Browse a topic below, or message our concierge team directly from any booking."
    >
      <div className="grid sm:grid-cols-2 gap-4 not-prose">
        {TOPICS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex gap-4 items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 transition-colors duration-300"
          >
            <div className="h-9 w-9 rounded-full bg-sky-500 flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                {title}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed font-medium">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <InfoParagraph>
        Can't find what you're after? Our concierge team is reachable 24/7
        through Guest Messages once you're signed in, or via the contact details
        on our{" "}
        <a href="/contact" className="text-sky-500 underline">
          Contact page
        </a>
        .
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default HelpCenterPage;
