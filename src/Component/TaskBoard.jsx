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
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import TaskColumn from "./TaskColumn";

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tasks`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // ✅ Handle Task Update
  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, ...updatedTask } : task))
      );

      Swal.fire({
        icon: "success",
        title: "Task Updated",
        text: "The task has been successfully updated!",
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
              onUpdate={handleTaskUpdate} // ✅ Pass onUpdate
              onDelete={handleTaskDelete} // ✅ Pass onDelete
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default TaskBoard;
