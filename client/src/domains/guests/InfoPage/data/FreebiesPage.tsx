import InfoPageLayout, { InfoParagraph } from "../component/InfoPageLayout";
import InfoPageSkeleton from "../component/InfoPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const FreebiesPage = () => {
  const isLoading = useSimulatedLoad();
  if (isLoading) return <InfoPageSkeleton />;

  return (
    <InfoPageLayout
      label="Freebies"
      title="Exclusive downloads & guides for our guests."
      subtitle="Unlock premium packing lists, desktop wallpapers, and local trail guides."
    >
      <InfoParagraph>
        Make your next retreat even more memorable with our curated digital assets. As a thank-you to the CabinHub community, these resources are entirely free to download.
      </InfoParagraph>
      <InfoParagraph>
        🗺️ <strong>Local Wilderness & Trekking Trail Guide (PDF)</strong> — Detailed maps of hidden routes, forest spots, and viewpoint pathways surrounding our elite cabins.
      </InfoParagraph>
      <InfoParagraph>
        🎒 <strong>Mountain Cabin Packing Checklist (PDF)</strong> — An essential checklist covering everything from cold-weather layers to bonfire essentials.
      </InfoParagraph>
      <InfoParagraph>
        🏔️ <strong>High-Resolution Retreat Wallpapers</strong> — Bring the serenity of CabinHub to your desktop and phone screens. Download 4K alpine landscapes.
      </InfoParagraph>
    </InfoPageLayout>
  );
};

export default FreebiesPage;
