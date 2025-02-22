import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_API_URL}`);

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
    socket.on("tasksUpdated", fetchTasks);
    return () => socket.off("tasksUpdated");
  }, []);

  const fetchTasks = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
    setTasks(data);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    movedTask.category = result.destination.droppableId;
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
    await axios.put(`${import.meta.env.VITE_API_URL}/tasks/${movedTask._id}`, movedTask);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {["To-Do", "In Progress", "Done"].map((category) => (
        <Droppable key={category} droppableId={category}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 w-1/3 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              {tasks.filter((task) => task.category === category).map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white p-3 mb-2 rounded shadow">
                      {task.title}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default TaskBoard;
