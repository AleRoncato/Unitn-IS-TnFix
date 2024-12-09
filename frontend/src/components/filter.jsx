import { ArrowDownIcon, CircleDot, Clock, SettingsIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

const Filter = ({ theme }) => {
  const [query, setQuery] = useState("");
  const [fetchedItems, setFetchedItems] = useState([
    "All",
    "Active",
    "Pending",
    "Resolved",
    "Closed",
  ]);


  return (
    <>
      <div className="h-1/6"></div>
      <div className="h-2/3 flex-col justify-center">
        <ul className="h-full flex flex-col justify-around text-xl font-mono font-semibold">
          <li className=" flex flex-col items-center underline underline-offset-3">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Link to={"/home"}>All</Link>
            </div>
          </li>
          <li className=" flex flex-col items-center text ">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Clock className="text-white mr-3" />
              <Link to={"/home/:#In accettazione"}>In accettazione</Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-green-500 mr-3" /> 
              <Link to={"/home/:#accettati"}> Accettati </Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-orange-400 mr-3" /> Programmati
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <SettingsIcon className="text-blue-500 mr-3" /> In risoluzione
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-red-500 mr-3" /> Closed
            </div>
          </li>
        </ul>
      </div>
    </>
  );

  function handleFilterChange(e) {
    setQuery(e.target.value);
  }


};

export default Filter;
