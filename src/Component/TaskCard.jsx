import { useDraggable } from "@dnd-kit/core";
import axios from "axios";
import { useState } from "react";
import { FiCheck, FiEdit, FiTrash2, FiX } from "react-icons/fi";
import Swal from "sweetalert2";

const TaskCard = ({ task, onDelete, onUpdate }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  // 🔹 Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
        editedTask
      );
      onUpdate(task._id, response.data); // Instantly update UI
      setIsEditing(false);
      Swal.fire("Updated!", "Task has been updated successfully.", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire("Error!", "Failed to update task.", "error");
    }
  };

  // 🔹 Handle Delete Task
  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/tasks/${task._id}`
          );
          onDelete(task._id); // Instantly update UI
          Swal.fire("Deleted!", "Task has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Error!", "Failed to delete task.", "error");
        }
      }
    });
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-white p-4 mb-3 rounded-lg shadow-lg cursor-grab border-l-4 
                 border-blue-500 flex flex-col gap-2 transition-all"
    >
      {/* 🔹 Task Status */}
      <span
        className={`px-2 py-1 text-xs font-semibold text-white rounded-full w-fit 
                      ${
                        task.category === "To-Do"
                          ? "bg-gray-500"
                          : task.category === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
      >
        {task.category}
      </span>

      {/* 🔹 Editable Fields */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="border px-2 py-1 rounded text-sm w-full focus:outline-none"
            autoFocus
          />
          <textarea
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            className="border px-2 py-1 rounded text-sm w-full focus:outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-2 py-1 text-xs rounded flex items-center gap-1"
            >
              <FiCheck /> Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-2 py-1 text-xs rounded flex items-center gap-1"
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3 className="font-semibold text-lg break-words w-full whitespace-normal">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm">{task.description}</p>
        </>
      )}

      {/* 🔹 Edit & Delete Buttons */}
      {!isEditing && (
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 text-sm flex items-center gap-1"
          >
            <FiEdit /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm flex items-center gap-1"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
