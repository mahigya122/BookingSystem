import { useEffect, useRef } from "react";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";
import type { CabinDetailSection } from "./CabinRow";
import { Globe, MapPin, Star, Tag, Sparkles } from "lucide-react";

interface Props {
  cabin: Cabin;
  activeBooking: Booking | null;
  initialSection?: CabinDetailSection;
  onClose: () => void;
}

const CabinDetailModal = ({
  cabin,
  activeBooking,
  initialSection = "overview",
  onClose,
}: Props) => {
  const isBooked = Boolean(activeBooking);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);
  const offersRef = useRef<HTMLDivElement | null>(null);
  const activitiesRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target =
      initialSection === "location"
        ? locationRef.current
        : initialSection === "offers"
          ? offersRef.current
          : initialSection === "activities"
            ? activitiesRef.current
            : initialSection === "reviews"
              ? reviewsRef.current
              : overviewRef.current;
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialSection]);

  const reviewCount = cabin.reviews?.length || 0;
  const avgRating = reviewCount > 0
    ? (cabin.reviews!.reduce((acc, review) => acc + review.rating, 0) / reviewCount).toFixed(1)
    : "N/A";

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-4xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-500">Cabin details</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{cabin.name}</h2>
          </div>

          <button onClick={onClose} className="btn btn-ghost h-9 w-9 p-0 text-xl" type="button">
            X
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div ref={overviewRef}>
            <img
              src={cabin.image_url}
              alt={cabin.name}
              className="w-full h-72 object-cover rounded-[1.75rem] border border-slate-100 dark:border-slate-800 shadow-xl"
            />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="surface-panel rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Price / Night</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  ${cabin.price_per_night.toLocaleString()}
                </p>
              </div>

              <div className="surface-panel rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Discount</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {cabin.discount || 0}%
                </p>
              </div>

              <div className="surface-panel rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Offers</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {cabin.offers?.length || 0}
                </p>
              </div>

              <div className="surface-panel rounded-2xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Reviews</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {reviewCount}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => locationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="btn-action btn-action-secondary justify-start"
            >
              <MapPin size={16} />
              Jump to Location
            </button>
            <button
              type="button"
              onClick={() => offersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="btn-action btn-action-primary justify-start"
            >
              <Tag size={16} />
              Jump to Offers
            </button>
          </div>

          <div className="surface-panel rounded-[1.75rem] p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">Booking Status</p>
              <span className={`badge ${isBooked ? "badge-danger" : "badge-success"}`}>
                {isBooked ? "Booked" : "Available"}
              </span>
            </div>

            {isBooked && activeBooking ? (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Booked by: {activeBooking.guests?.full_name || "Unknown guest"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Guest email: {activeBooking.guests?.email || "Not available"}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Booked dates: {new Date(activeBooking.start_date).toLocaleDateString()} - {new Date(activeBooking.end_date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This cabin is currently available. No active booking is linked to it.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {cabin.description || "No description available."}
            </p>
          </div>

          <div ref={locationRef} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-sky-500" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Location</h3>
            </div>

            {cabin.location ? (
              <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="surface-panel rounded-2xl p-5 space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">{cabin.location.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {cabin.location.description || "This area is linked to the cabin and can be used as the location record."}
                  </p>
                  <p className="text-xs font-bold text-slate-400">
                    {cabin.location.city || "Unknown city"}{cabin.location.country ? `, ${cabin.location.country}` : ""}
                  </p>
                </div>

                <div className="surface-panel rounded-2xl overflow-hidden min-h-48">
                  {cabin.location.image_url ? (
                    <img
                      src={cabin.location.image_url}
                      alt={cabin.location.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full min-h-48 grid place-items-center text-slate-400">
                      No location image
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No location is linked to this cabin.</p>
            )}
          </div>

          <div ref={offersRef} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-emerald-500" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Connected Offers</h3>
              <span className="badge badge-primary ml-2">{cabin.offers?.length || 0}</span>
            </div>

            {cabin.offers && cabin.offers.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {cabin.offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="surface-panel rounded-2xl p-5 space-y-2 border border-emerald-100 dark:border-emerald-900/30"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-slate-900 dark:text-white">
                        {offer.title || offer.name || "Offer"}
                      </p>
                      <span className="badge badge-success">
                        {(offer.discount_percent ?? offer.discount_pct ?? 0)}% OFF
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {offer.description || "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No offers are linked to this cabin.</p>
            )}
          </div>

          <div ref={activitiesRef} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-500" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Connected Activities</h3>
            </div>

            {cabin.activities && cabin.activities.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {cabin.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="surface-panel rounded-2xl p-5 space-y-2 border border-cyan-100 dark:border-cyan-900/30"
                  >
                    <p className="font-black text-slate-900 dark:text-white">{activity.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {activity.description || "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No activities are linked to this cabin.</p>
            )}
          </div>

          <div ref={reviewsRef} className="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-8">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Guest Reviews</h3>
              <span className="badge badge-warning ml-2">{reviewCount}</span>
              <span className="text-sm font-bold text-slate-400">Avg {avgRating}</span>
            </div>

            {cabin.reviews && cabin.reviews.length > 0 ? (
              <div className="space-y-4">
                {cabin.reviews.map((review) => (
                  <div key={review.id} className="surface-panel rounded-2xl p-5 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-black text-slate-900 dark:text-white">
                        {review.guest?.full_name || "Anonymous Guest"}
                      </p>
                      <span className="badge badge-warning">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {review.comment || "No comment provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No reviews are linked to this cabin.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabinDetailModal;
