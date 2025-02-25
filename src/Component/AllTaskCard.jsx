const AllTaskCard = ({ task }) => {
    return (
      <div className="bg-white p-4 mb-3 rounded-lg shadow-lg border-l-4 border-blue-500 flex flex-col gap-2 transition-all">
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
  
        {/* 🔹 Task Details */}
        <h3 className="font-semibold text-lg break-words w-full whitespace-normal">
          {task.title}
        </h3>
        <p className="text-gray-600 text-sm">{task.description}</p>
      </div>
    );
  };
  
  export default AllTaskCard;
  