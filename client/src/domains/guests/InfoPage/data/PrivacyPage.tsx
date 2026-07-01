import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const PrivacyPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Privacy Policy"
      title="Your trust is our most valuable asset."
      subtitle="Last updated June 2026"
    >
      <InfoParagraph>
        We only collect what's needed to run a booking — your account details,
        stay dates, payment confirmation, and messages with your host. We don't
        collect more than that just because we could.
      </InfoParagraph>
      <InfoParagraph>
        Your data is encrypted in transit and at rest, and access inside
        CabinHub is limited to the people who need it to support your stay —
        mainly our concierge and trust & safety teams.
      </InfoParagraph>
      <InfoParagraph>
        We never sell guest or host data to third parties. Where we do share
        data — payment processing, for instance — it's with vetted providers
        bound by their own confidentiality obligations, and only for the purpose
        of completing your booking.
      </InfoParagraph>
      <InfoParagraph>
        You can request a copy of your data or ask us to delete your account at
        any time from your Profile settings, or by reaching out through the{" "}
        <a href="/contact" className="text-sky-500 underline">
          Contact page
        </a>
        .
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default PrivacyPage;
