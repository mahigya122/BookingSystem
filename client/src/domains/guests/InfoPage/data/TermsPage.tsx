import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const TermsPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Terms of Service"
      title="The foundation of our community."
      subtitle="Last updated June 2026"
    >
      <InfoParagraph>
        By creating a CabinHub account or booking a cabin, you agree to treat
        listed properties, their hosts, and the surrounding communities with the
        same respect you'd expect as a guest yourself.
      </InfoParagraph>
      <InfoParagraph>
        Bookings are a contract between you and the host, facilitated by
        CabinHub. Cancellation terms, pricing, and house rules are set per
        listing and shown before you confirm — read them, since they govern
        refunds if plans change.
      </InfoParagraph>
      <InfoParagraph>
        Misuse of the platform — fraudulent bookings, harassment of hosts or
        guests, or circumventing our payment system — can result in suspension
        of your account without refund.
      </InfoParagraph>
      <InfoParagraph>
        We may update these terms as the platform evolves. Material changes will
        be communicated by email before they take effect.
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default TermsPage;
