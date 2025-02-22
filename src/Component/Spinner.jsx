import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin">
        <div className="w-full h-full border-t-4 border-r-4 border-b-4 border-l-4 border-solid border-t-transparent border-l-transparent border-r-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Spinner;