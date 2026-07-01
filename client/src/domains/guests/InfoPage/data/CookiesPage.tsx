import { Cookie } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const CookiesPage = () => (
  <InfoPageLayout
    title="Cookie Policy"
    subtitle="Enhancing your digital journey."
    icon={Cookie}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      We use cookies to remember your preferences and provide a more
      personalized browsing experience.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      You can manage your cookie settings at any time through your browser
      preferences.
    </p>
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      We only use essential and performance-enhancing cookies to make our
      platform faster and more intuitive.
    </p>
  </InfoPageLayout>
);

export default CookiesPage;
