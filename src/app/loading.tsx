export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#E8002D] mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
