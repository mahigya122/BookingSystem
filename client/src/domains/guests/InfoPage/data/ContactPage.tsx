import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const CONTACT_METHODS = [
  { icon: Mail, label: "Email", value: "concierge@cabinhub.com" },
  { icon: Phone, label: "Phone", value: "+1 (800) 555-CABIN" },
  {
    icon: MessageCircle,
    label: "In-App",
    value: "Message us via Guest Messages",
  },
];

const ContactPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Contact Us"
      title="We're here to listen and assist."
      subtitle="For anything booking-related, Guest Messages is the fastest way to reach your host directly."
    >
      <div className="grid sm:grid-cols-3 gap-4 not-prose">
        {CONTACT_METHODS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
          >
            <div className="h-9 w-9 rounded-full bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {label}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
        <InfoParagraph>
          Our headquarters sits in the Cascade Mountains, but our concierge team
          supports guests and hosts wherever a CabinHub cabin happens to be.
        </InfoParagraph>
      </div>
    </InfoPageLayout>
  );
};

export default ContactPage;
