import { ArrowDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Filter = ({ theme }) => {
    const [query, setQuery] = useState('');
    const [fetchedItems, setFetchedItems] = useState(["2024", "2023", "2022", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021", "2021"]);

    const [isVisible, setIsVisible] = useState([]);

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

    useEffect(() => {
        setIsVisible(fetchedItems.map(() => false));
    }, []);




    const toggleVisibility = (index) => {

        setIsVisible((prev) => prev.map((isVisible, i) => (i === index ? !isVisible : isVisible)));
    };

    return (
        <div className="h-full">

            <ul className='h-full overflow-hidden flex-col'>
                {fetchedItems.map((item, index) => (
                    <li key={index} onClick={() => toggleVisibility(index)}
                        className={`text-lg font-mono font-semibold flex flex-col items-center`}
                    >
                        <div className={'flex items-center justify-center w-full hover:text-neutral-400'}>{item}</div>

                        {isVisible[index] && (

                            <ul onClick={() => toggleVisibility(index)} className={`flex flex-col items-center justify-center my-2 font-semibold text-sm`}>
                                <li className='hover:text-neutral-400'>Active</li>
                                <li className='hover:text-neutral-400'>Pending</li>
                                <li className='hover:text-neutral-400'>Resolved</li>
                                <li className='hover:text-neutral-400'>Closed</li>
                                <li className='hover:text-neutral-400'>All</li>
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

        </div>
    );





};



export default Filter;