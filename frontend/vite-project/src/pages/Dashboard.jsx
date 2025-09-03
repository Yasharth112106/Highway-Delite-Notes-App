import { useNavigate } from "react-router-dom";
import Notes from "./Notes";
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!token || !user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="flex items-center font-bold gap-1 text-blue-500 hover:text-blue-700"
        >
           Sign Out
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4 text-xl">
        <h3 className="font-semibold">Welcome, {user?.name}!</h3>
        <p className="text-gray-500 text-sm">Email: {user?.email}</p>
      </div>

      <Notes token={token} />
    </div>
  );
}
