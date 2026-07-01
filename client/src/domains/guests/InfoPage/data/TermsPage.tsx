import { FileText } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const TermsPage = () => (
  <InfoPageLayout
    title="Terms of Service"
    subtitle="The foundation of our community."
    icon={FileText}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      By using CabinHub, you agree to respect the natural environments and local
      communities that host our cabins.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      Our terms ensure a fair and transparent relationship between guests,
      hosts, and our platform.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      Please review our guest conduct guidelines and booking conditions to
      ensure a harmonious experience for everyone.
    </p>
  </InfoPageLayout>
);

export default TermsPage;
