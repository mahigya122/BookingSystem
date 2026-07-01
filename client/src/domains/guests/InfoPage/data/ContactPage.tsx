import { Phone, Mail, MapPin } from "lucide-react";
import InfoPageLayout from "../component/InfoPageLayout";

const ContactPage = () => (
  <InfoPageLayout
    title="Contact Us"
    subtitle="We're here to listen and assist."
    icon={Phone}
  >
    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
      Have a question or need specialized assistance? Our team of travel
      curators is ready to help.
    </p>

    <div className="not-prose grid sm:grid-cols-2 gap-4">
      <div className="flex items-start gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Mail className="h-6 w-6 text-sky-500 shrink-0" />
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Email
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            concierge@cabinhub.com
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Phone className="h-6 w-6 text-sky-500 shrink-0" />
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Phone
          </p>
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            +1 (800) 555-CABIN
          </p>
        </div>
      </div>
    </div>

    <p className="text-xl md:text-2xl leading-relaxed text-slate-600 dark:text-slate-400 font-medium flex items-start gap-3">
      <MapPin className="h-6 w-6 text-sky-500 shrink-0 mt-1" />
      Our physical headquarters is nestled in the Cascade Mountains, but our
      heart is wherever you choose to escape.
    </p>
  </InfoPageLayout>
);

export default ContactPage;
