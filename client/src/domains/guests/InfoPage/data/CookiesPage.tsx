import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const CookiesPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Cookie Policy"
      title="Enhancing your digital journey."
      subtitle="Last updated June 2026"
    >
      <InfoParagraph>
        We use essential cookies to keep you signed in, remember your search
        filters on the Explore page, and keep your cart/checkout state intact if
        you navigate away mid-booking.
      </InfoParagraph>
      <InfoParagraph>
        A small set of performance cookies help us understand which cabins and
        destinations guests browse most, so we know where to focus curation
        next. These never contain personal or payment data.
      </InfoParagraph>
      <InfoParagraph>
        You can clear or block cookies at any time through your browser settings
        — note that blocking essential cookies may sign you out or reset saved
        filters.
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default CookiesPage;
