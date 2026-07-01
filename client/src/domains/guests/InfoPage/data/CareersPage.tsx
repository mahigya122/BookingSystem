import { Briefcase } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const CareersPage = () => (
  <InfoPageLayout
    title="Join the Team"
    subtitle="Help us build the future of travel."
    icon={Briefcase}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      We&rsquo;re looking for passionate individuals who love nature and believe
      in the power of great design.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      From engineers to hospitality experts, we offer remote-first roles with
      regular team retreats in our finest cabins.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      Check back soon for specific openings or send your resume to{" "}
      <a href="mailto:talent@cabinhub.com" className="text-sky-500 underline">
        talent@cabinhub.com
      </a>
      .
    </p>
  </InfoPageLayout>
);

export default CareersPage;
