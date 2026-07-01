import { Navigate, useParams } from "react-router-dom";
import { LEGACY_INFO_SLUG_MAP, PATHS } from "../../../../app/path";

/**
 * Mounted at the OLD route: <Route path="/info/:slug" element={<LegacyInfoRedirect />} />
 * Sends any /info/about, /info/blog, etc. to the new standalone path.
 * Remove this once nothing external links to /info/* anymore.
 */
const LegacyInfoRedirect = () => {
  const { slug } = useParams();
  const target = (slug && LEGACY_INFO_SLUG_MAP[slug]) || PATHS.HOME;
  return <Navigate to={target} replace />;
};

export default LegacyInfoRedirect;
