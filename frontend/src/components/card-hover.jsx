import { X } from "lucide-react";
import React from "react";
import TicketControls from "./ticket-controls";


const Card_hover = ({ datas, setData, index, visible, toggleVisibility }) => {


  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleVisibility();
    }
  };

  const data = datas[index];

  return (
    <>
      <div onClick={handleOutsideClick} className={`fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50`}>
        <div className={`bg-black border text-white  border-gray-300 p-6 rounded-lg w-11/12 h-5/6 overflow-auto transition-transform duration-300 transform ${visible ? 'scale-100' : 'scale-95'}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className=" text-2xl font-bold">{data.title}</h2>
            <X onClick={toggleVisibility} className="cursor-pointer " />
          </div>
          <div className="flex flex-col">
            <p className="text-sm">{data.type}</p>
          </div>
          <p className="text-sm">{data.description}</p>
          <p className="text-sm">{data.location}</p>

          <TicketControls datas={datas} index={index} setData={setData} />

        </div>
      </div>
    </>
  );
};

export default Card_hover;
