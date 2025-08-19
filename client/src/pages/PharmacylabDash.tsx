export default function EntityDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome!
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Admin has accepted your login request. You will now receive prescription details from users directly via email.
        </p>
      </div>
    </div>
  );
}