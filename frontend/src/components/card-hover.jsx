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
      <div onClick={handleOutsideClick} className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
        <div className={`bg-white border border-gray-300 p-6 rounded-lg w-11/12 h-5/6 overflow-auto transition-transform duration-300 transform ${visible ? 'scale-100' : 'scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-black text-2xl font-bold">{data.title}</h2>
            <X onClick={toggleVisibility} className="cursor-pointer text-black" />
          </div>
          <div className="text-black space-y-4">
            <p className="text-lg">{data.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Details</h3>
                <p>{data.details}</p>
              </div>
              <div>
                <h3 className="font-semibold">Additional Info</h3>
                <p>{data.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card_hover;
