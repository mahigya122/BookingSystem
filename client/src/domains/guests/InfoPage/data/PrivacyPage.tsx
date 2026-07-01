import { Shield } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const PrivacyPage = () => (
  <InfoPageLayout
    title="Privacy Policy"
    subtitle="Your trust is our most valuable asset."
    icon={Shield}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      At CabinHub, we take your privacy as seriously as your comfort. This
      policy outlines how we protect and manage your data.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      We only collect information essential to providing our services, such as
      booking details and communication preferences.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      We never sell your data to third parties. Your information is encrypted
      and stored in secure, world-class data centers.
    </p>
  </InfoPageLayout>
);

export default PrivacyPage;
