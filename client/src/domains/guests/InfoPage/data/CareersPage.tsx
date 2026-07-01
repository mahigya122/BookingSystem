import { Compass, Home, MapPin } from "lucide-react";
import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const PERKS = [
  {
    icon: Home,
    title: "Remote-First",
    desc: "Work from anywhere — including one of our own cabins.",
  },
  {
    icon: MapPin,
    title: "Team Retreats",
    desc: "Twice-yearly team trips to properties on the platform.",
  },
  {
    icon: Compass,
    title: "Explorer Stipend",
    desc: "An annual credit toward booking CabinHub cabins yourself.",
  },
];

const CareersPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Careers"
      title="Help us build the future of nature escapes."
      subtitle="We're a small, remote-first team that believes in the work as much as the places we list."
    >
      <InfoParagraph>
        We're looking for people who care about craft — in hospitality, in
        design, in code — and who'd rather build something deliberate than move
        fast and list everything.
      </InfoParagraph>

      <div className="grid sm:grid-cols-3 gap-4 not-prose">
        {PERKS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2"
          >
            <Icon className="h-5 w-5 text-sky-500" />
            <p className="font-black text-slate-900 dark:text-white text-sm">
              {title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
              {desc}
            </p>
          </div>
        ))}
      </div>

      <InfoParagraph>
        We don't have open roles listed right now, but we're always glad to hear
        from people who'd be a good fit. Send a note and your resume to{" "}
        <a href="mailto:talent@cabinhub.com" className="text-sky-500 underline">
          talent@cabinhub.com
        </a>
        .
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default CareersPage;
