import { HelpCircle } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const HelpCenterPage = () => (
  <InfoPageLayout
    title="Help Center"
    subtitle="Everything you need to know for a seamless stay."
    icon={HelpCircle}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      Welcome to the CabinHub Help Center. We are dedicated to ensuring your
      experience is as serene as our locations.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      From technical booking assistance to local destination guides, our
      resources are designed to provide immediate clarity.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      If you can&rsquo;t find what you&rsquo;re looking for, our concierge team
      is available 24/7 to assist with your specific needs.
    </p>
  </InfoPageLayout>
);

export default HelpCenterPage;
