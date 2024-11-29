import { X } from "lucide-react";
import React from "react";

const Card_hover = ({ data, visible, toggleVisibility }) => {

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleVisibility();
    }
  };

  return (
    <>
      {visible && (
        <div onClick={handleOutsideClick} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black border border-white p-4 rounded-lg w-11/12 h-5/6">
            <div className="flex justify-between items-start">
              <X onClick={toggleVisibility} className="cursor-pointer text-white" />
            </div>
            <h2 className="text-white">{data.title}</h2>
            <p className="text-white">{data.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Card_hover;
