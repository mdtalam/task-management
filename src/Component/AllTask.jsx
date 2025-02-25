import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Providers/AuthProvider";
import AllTaskCard from "./AllTaskCard";

const AllTask = () => {
  const { user } = useContext(AuthContext); // ✅ Get logged-in user info
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    // ✅ Fetch all tasks for the logged-in user
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/tasks`)
      .then((res) => {
        setTasks(res.data); // ✅ Store all tasks
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">All Tasks</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <AllTaskCard key={task._id} task={task} index={index} />
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default AllTask;
