import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const TaskColumn = ({ category, tasks, onUpdate, onDelete }) => {
  // ✅ Register as a "droppable" zone
  const { setNodeRef } = useDroppable({
    id: category,
    data: { category }, // ✅ Ensure this data is accessible in onDragEnd
  });

  return (
    <div 
      ref={setNodeRef} 
      className="w-full bg-gray-100 p-4 rounded-lg shadow-md min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]"
    >
      <h2 className="text-lg font-semibold mb-3">{category}</h2>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard 
            key={task._id} 
            task={task} 
            onUpdate={onUpdate}  // ✅ Pass the update function
            onDelete={onDelete}  // ✅ Pass the delete function
          />
        ))
      ) : (
        <p className="text-gray-500 text-center">No tasks</p>
      )}
    </div>
  );
};

export default TaskColumn;
