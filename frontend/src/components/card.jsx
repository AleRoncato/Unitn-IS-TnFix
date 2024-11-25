import React from "react";

const Card = ({ theme, data }) => {

  return (
    <div className={`${theme === "dark" ? "bg-neutral-900" : "bg-white"} `} >
      <h2 className={`${theme === "dark" ? "text-white" : "text-black"} text-xl font-bold"`}>{data.title}</h2>
      <p className={`${theme === "dark" ? "text-neutral-600" : "text-neutral-400"}`}>{data.description}</p>
    </div>
  );
};

export default Card;
