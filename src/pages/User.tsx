import { useGuests } from "../authentication/useGuests";

const User = () => {
  const { guests, isLoading } = useGuests();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Guests</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading guests...</p>
      ) : guests && guests.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Full Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {[...guests].reverse().map((guest: any) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{guest.full_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{guest.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{guest.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No guests available.</p>
      )}
    </div>
  );
};

export default User;
