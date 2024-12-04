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

  // const [isVisible, setIsVisible] = useState([]);

  // useEffect(() => {
  //     const fetchItems = async () => {
  //         try {
  //             const response = await fetch('https://api.example.com/items');
  //             const data = await response.json();
  //             setFetchedItems(data);
  //         } catch (error) {
  //             console.error('Error fetching items:', error);
  //         }
  //     };

  //     fetchItems();
  // }, []);

  // useEffect(() => {
  //     setIsVisible(fetchedItems.map(() => false));
  // }, []);

  // const toggleVisibility = (index) => {

  //     setIsVisible((prev) => prev.map((isVisible, i) => (i === index ? !isVisible : isVisible)));
  // };

  return (
    <>
      <div className="h-1/6"></div>
      <div className="h-2/3 flex-col justify-center">
        <ul className="h-full flex flex-col justify-around text-xl font-mono font-semibold">
          <li className=" flex flex-col items-center underline underline-offset-3">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Link to={"/add-ticket"}>All</Link>
            </div>
          </li>
          <li className=" flex flex-col items-center text ">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <Clock className="text-white mr-3" />
              <Link to={"/login"}>In accettazione</Link>
            </div>
          </li>
          <li className=" flex flex-col items-center">
            <div className="flex items-center justify-center w-full hover:text-neutral-400">
              <CircleDot className="text-green-500 mr-3" /> Accettati
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

  {
    /* {fetchedItems.map((item, index) => (
                    <li key={index} onClick={() => toggleVisibility(index)}
                        className={` flex flex-col items-center`}
                    >
                        <div className={'flex items-center justify-center w-full hover:text-neutral-400'}>{item}</div>

                <li key={2} onClick={() => toggleVisibility()}
                    className={`text-lg font-mono font-semibold flex flex-col items-center`}
                >
                    <div className={'flex items-center justify-center w-full hover:text-neutral-400'}>HYSTORY</div>


                    {isVisible && (

                        <ul onClick={() => toggleVisibility()} className={`flex flex-col items-center justify-center my-2 font-semibold text-sm`}>
                            <li className='hover:text-neutral-400'>All</li>
                            <li className='hover:text-neutral-400'>2024</li>
                            <li className='hover:text-neutral-400'>2023</li>
                            <li className='hover:text-neutral-400'>2022</li>
                            <li className='hover:text-neutral-400'>2021</li>
                        </ul>
                    )}
                </li>

                            <ul onClick={() => toggleVisibility(index)} className={`flex flex-col items-center justify-center my-2 font-semibold text-sm`}>
                                <li className='hover:text-neutral-400'>Active</li>
                                <li className='hover:text-neutral-400'>Pending</li>
                                <li className='hover:text-neutral-400'>Resolved</li>
                                <li className='hover:text-neutral-400'>Closed</li>
                                <li className='hover:text-neutral-400'>All</li>
                            </ul>
                        )}
                    </li>
                ))} */
  }
};

export default Filter;
