import type { Cabin } from "../../types/cabin";

interface Props {
  cabin: Cabin;
  onClose: () => void;
}

const CabinDetailModal = ({ cabin, onClose }: Props) => {
    return (
      <div className="modal-overlay">
        <div className="modal-content w-full max-w-2xl space-y-5 p-6">

                <img 
                 src={cabin.image_url}
                 alt={cabin.name}
                 className="w-full h-72 object-cover rounded-lg"
                />
                <div className="p-6 space-y-5">

                    {/* HEADER */}
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold">
                {cabin.name}
              </h2>

              <p className="text-gray-500">
                Capacity: {cabin.capacity} guests
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost h-9 w-9 p-0 text-xl"
            >
              ✕
            </button>

          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4">

            <div className="surface-panel rounded-xl p-4">
                <p className="text-sm text-gray-500">
                    Price / Night
                </p>

                <p className="text-2xl font-bold">
                    ${cabin.price_per_night}
                </p>
            </div>

            <div className="surface-panel rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Discount
              </p>

              <p className="text-2xl font-bold">
                {cabin.discount || 0}%
              </p>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Description
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {cabin.description || "No description available."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CabinDetailModal;