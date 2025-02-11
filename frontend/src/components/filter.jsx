import {  Calendar1Icon, CircleDot, Clock, SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

const Filter = () => {

  // "In accettazione",
  // "Accettato",
  // "Programmato",
  // "Confermare",
  // "In risoluzione",
  // "Closed",


  return (
    <>
      <div className="h-1/6"></div>
      <div className="h-2/3 flex-col justify-center">
        <ul className="h-full flex flex-col justify-around text-xl font-mono font-semibold">
          
          <li className=" flex flex-col items-center ">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Calendar1Icon className="text-white mr-3" />
              <Link to={"/home/:#"}>Updates</Link>
            </div>
          </li>
          <li className=" flex flex-col items-center text ">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Clock className="text-white mr-3" />
              <Link to={"/home/:Accettazione"}> In accettazione </Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-green-500 mr-3" />
              <Link to={"/home/:Accettato"}> Accettati </Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-orange-400 mr-3" /> 
              <Link to={"/home/:Programmato"}> Programmati </Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <SettingsIcon className="text-blue-500 mr-3" /> 
              <Link to={"/home/:Risoluzione"}> In risoluzione </Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-red-500 mr-3" /> 
              <Link to={"/home/:Closed"}> Closed </Link>
            </div>
          </li>
        </ul>
      </div>
    </>
  );



};

export default Filter;
