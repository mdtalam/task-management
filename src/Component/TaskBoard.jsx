import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import { AuthContext } from "../Providers/AuthProvider"; // ✅ Import Auth Context
import TaskColumn from "./TaskColumn";

const TaskBoard = () => {
  const { user } = useContext(AuthContext); // ✅ Get logged-in user info
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return; // ✅ Ensure user is logged in

    axios
      .get(`${import.meta.env.VITE_API_URL}/tasks?email=${user.email}`)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setLoading(false);
      });
  }, [user?.email]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // ✅ Handle Task Update
  const handleTaskUpdate = (taskId, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  
    axios
      .patch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, updatedTask)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Task Updated",
          text: "The task has been successfully updated!",
          timer: 2000,
        });
      })
      .catch((error) => console.error("Error updating task:", error));
  };
  
  // ✅ Handle Task Deletion
  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      Swal.fire({
        icon: "success",
        title: "Task Deleted",
        text: "The task has been successfully deleted!",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Handle Drag & Drop
  const onDragEnd = ({ active, over }) => {
    if (!over) return;

    const activeTask = tasks.find((task) => task._id === active.id);
    if (!activeTask) return;

    const newCategory = over.data?.current?.category;

    if (newCategory && activeTask.category !== newCategory) {
      handleTaskUpdate(activeTask._id, { category: newCategory });
    } else {
      const categoryTasks = tasks.filter((task) => task.category === activeTask.category);
      const oldIndex = categoryTasks.findIndex((task) => task._id === active.id);
      const newIndex = categoryTasks.findIndex((task) => task._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedCategoryTasks = arrayMove(categoryTasks, oldIndex, newIndex);

        setTasks((prevTasks) => {
          return prevTasks.map((task) => {
            const updatedTask = updatedCategoryTasks.find((t) => t._id === task._id);
            return updatedTask || task;
          });
        });

        axios
          .patch(`${import.meta.env.VITE_API_URL}/tasks/reorder`, {
            reorderedTasks: updatedCategoryTasks,
          })
          .catch((err) => console.error("Error reordering tasks:", err));
      }
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading tasks...</p>;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Task Management</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <TaskColumn
              key={category}
              category={category}
              tasks={tasks.filter((task) => task.category === category)}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default TaskBoard;
