import { X } from "lucide-react";
import React from "react";
import TicketControls from "./ticket-controls";
import { useEffect } from "react";


const Card_hover = ({ datas, setData, index, visible, toggleVisibility }) => {

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "Escape" && visible) {
        toggleVisibility();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [visible, toggleVisibility]);

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleVisibility();
    }
  };

  const data = datas[index];

  return (
    <>
      <div onClick={handleOutsideClick} className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
        <div className={`bg-neutral-800 border text-white border-neutral-600 p-6 rounded-lg w-11/12 h-5/6 overflow-auto transition-transform duration-300 transform ${visible ? 'scale-100' : 'scale-95'}`}>
          <X onClick={toggleVisibility} className="absolute right-8 top-8 cursor-pointer text-gray-500 hover:text-gray-700" size={32} />
          <div className="m-2 text-center">
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <hr className="my-4 border-neutral-600" />
          </div>
          <div className="mb-4 flex flex-row justify-around items-center">
            <div className="flex flex-col items-center">
              <p><strong>Type:</strong> {data.type}</p>
              <p><strong>Building:</strong> {data.building}</p>
              <p><strong>Floor:</strong> {data.floor}</p>
              <p><strong>Room:</strong> {data.room}</p>
            </div>
            <div>
              {data.images && data.images.length > 0 && (
                <div className="flex flex-wrap justify-center">
                  {data.images.map((image, idx) => (
                    <img key={idx} src={image} alt={`Image ${idx + 1}`} className="m-2 max-w-xs max-h-48 object-cover rounded-lg shadow-md" />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mb-4 flex flex-row justify-around">
            <input type="date" className="text-black w-1/3 p-2 border border-neutral-600 rounded-md" value={data.inizio || ""} />
            <p><strong>Start:</strong> {data.inizio || "DD/MM/YYYY"}</p>
            <p><strong>End:</strong> {data.fine || "DD/MM/YYYY"}</p>
            <p><strong>Status:</strong> {data.state}</p>
          </div>
          <TicketControls datas={datas} index={index} setData={setData} />
        </div>
      </div>
    </>
  );
};

export default Card_hover;
