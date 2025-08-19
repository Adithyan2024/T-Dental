export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Pending Admin Approval
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Your account is waiting for admin approval. Once approved, you will receive prescription details directly via email from users.
        </p>
      </div>
    </div>
  );
}