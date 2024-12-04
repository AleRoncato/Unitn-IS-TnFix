import { ArrowDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Filter = ({ theme }) => {

    const [fetchedItems, setFetchedItems] = useState(["Active", "Pending", "Resolved", "Closed", "All"]);

    const [isVisible, setIsVisible] = useState([]);

    useEffect(() => {
        setIsVisible(false);
    }, []);




    const toggleVisibility = () => {

        setIsVisible((prev) => !prev);
    };

    return (



        <div className="h-full">

            <ul className='h-full overflow-hidden flex-col'>
                <li key={1}
                    className={`text-lg font-mono font-semibold flex flex-col items-center`}
                >
                    <div className={'flex items-center justify-center w-full hover:text-neutral-400'}>ACTIVE</div>
                </li>

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

            </ul>
        </div>
    );





};




// <div className="h-full">

//     <ul className='h-full overflow-hidden flex-col'>
//         {fetchedItems.map((item, index) => (
//             <li key={index} onClick={() => toggleVisibility(index)}
//                 className={`text-lg font-mono font-semibold flex flex-col items-center`}
//             >
//                 <div className={'flex items-center justify-center w-full hover:text-neutral-400'}>{item}</div>

//                 {isVisible[index] && (

//                     <ul onClick={() => toggleVisibility(index)} className={`flex flex-col items-center justify-center my-2 font-semibold text-sm`}>
//                         <li className='hover:text-neutral-400'></li>
//                         <li className='hover:text-neutral-400'>Pending</li>
//                         <li className='hover:text-neutral-400'>Resolved</li>
//                         <li className='hover:text-neutral-400'>Closed</li>
//                         <li className='hover:text-neutral-400'>All</li>
//                     </ul>
//                 )}
//             </li>
//         ))}
//     </ul>

export default Filter;