import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const AddTaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");
  const [priority, setPriority] = useState("Medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    if (!title.trim()) {
      setError("Title is required!");
      setLoading(false);
      return;
    }
  
    const newTask = { title, description, category, priority, timestamp: new Date().toISOString() };
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks`, newTask);
  
      if (response.status === 201) {
        setTitle("");
        setDescription("");
        setCategory("To-Do");
        setPriority("Medium");
        setError("");

        // ✅ Show success alert
        Swal.fire({
          icon: "success",
          title: "Task Added!",
          text: "Your task has been successfully added.",
          timer: 2000, // Auto-close after 2 seconds
          showConfirmButton: false,
        });

        if (typeof onTaskAdded === "function") {
          onTaskAdded(); // Refresh task list
        } else {
          console.warn("onTaskAdded is not a function.");
        }
      } else {
        setError("Unexpected server response!");
      }
    } catch (error) {
      console.error("Task Save Error:", error);
      setError("Error saving task! " + (error.response?.data?.error || "Please try again."));
    }
  
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Add New Task</h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <input
        type="text"
        placeholder="Task Title (max 50 chars)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        maxLength="50"
        required
      />

      <textarea
        placeholder="Task Description (optional, max 200 chars)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        maxLength="200"
      ></textarea>

      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-1/2 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-4 transition duration-200"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddTaskForm;
