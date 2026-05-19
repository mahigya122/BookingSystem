import { useCabins } from "../authentication/useCabins";

const Cabins = () => {
  const { cabins, isLoading } = useCabins();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Cabins</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading cabins...</p>
      ) : cabins && cabins.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Capacity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price/Night</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {[...cabins].reverse().map((cabin: any) => (
                <tr key={cabin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {cabin.image_url ? (
                      <img 
                        src={cabin.image_url} 
                        alt={cabin.name}
                        className="h-16 w-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/80x60?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="h-16 w-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{cabin.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cabin.capacity} guests</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">${cabin.price_per_night}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cabin.discount || 0}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{cabin.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No cabins available.</p>
      )}
    </div>
  );
};

export default Cabins;
