import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Card = ({ theme, data }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-black">
      <h2 className="text-xl font-bold">{data.title}</h2>
      <p>{data.description}</p>
    </div>
  );
};

export default Card;
