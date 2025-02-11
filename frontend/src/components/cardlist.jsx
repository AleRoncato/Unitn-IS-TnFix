import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card_hover from './card-hover';
import FilterCardComponent from './FilterCardComponent';
import axios from 'axios';

const CardList = () => {

    const { status } = useParams();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState(data);

    // this should become part of the cardlist component
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    const [visible, setVisible] = useState(false);

    const handleCardClick = (index) => {
        setHoveredCardIndex((prev) => prev === index ? null : index);
        toggleVis();
    };

    const toggleVis = () => {
        setVisible(true);
    };

    const closeHoverCard = () => {
        setVisible(false);
        setHoveredCardIndex(null);
    };

    useEffect(() => {
        if (status === ':') {
            axios.get('http://localhost:5000/updates', {

                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}` // Send JWT token
                }
            })
                .then((response) => {
                    console.log(response.data);
                    setData(response.data);
                    setFilteredData(response.data);

                })
                .catch((error) => {
                    console.error(error);
                    alert('An error occurred. Please try again later');
                });
        } else {

            let param = status.replace(':', '');

            if (param === 'Risoluzione') {
                param = 'In risoluzione';
            }
            else if (param === 'Accettazione') {
                param = 'In accettazione';
            }

            axios.get(`http://localhost:5000/tickets/${param}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}` // Send JWT token
                }
            })
                .then((response) => {
                    setData(response.data.tickets);
                    setFilteredData(response.data.tickets);

                })
                .catch((error) => {
                    console.error(error);
                    alert('An error occurred. Please try again later');
                });
        }
    }, [status]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    return (
        <>
            <div className='flex overflow-scroll mb-10'>

                <div className="my-5 h-fit">
                    <FilterCardComponent cards={data} setData={setFilteredData} />
                </div>
                <div className="h-100vh w-full mx-12 my-2">
                    {filteredData.length > 0 ? (
                        <div>
                            {filteredData.map((card, index) => (
                                <div
                                    key={index}
                                    className={`bg-[#F2E9E4] ring-1 ring-black/5 
                                    backdrop-filter backdrop-blur-xl
                                    text-neutral-900 p-4 m-2 rounded-2xl cursor-default my-2.5`}
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className='flex flex-col justify-between *:m-3 *:font-mono'>
                                        <div className='flex flex-row justify-around'>
                                            <div className='justify-around'>
                                                <div className="flex flex-col"></div>
                                                <h2 className="text-2xl text-red-500 font-extrabold">{card.title} </h2>
                                                <p className="text-md font-bold">{card.type}</p>
                                            </div>
                                            <div className='flex-col justify-center items-center'>
                                                <p className="text-md font-bold"> 📍 {card.building}</p>
                                                <p className="pl-5 text-xs"> {card.floor}</p>
                                                <p className="pl-5 text-xs"> {card.room}</p>
                                            </div>
                                        </div>
                                        <div className='flex justify-around my-3'>
                                            <p className="text-sm">📅 {card.inizio == null ? "DD/MM/YYYY" : card.inizio}</p>
                                            <p className="text-sm">📅 {card.fine == null ? "DD/MM/YYYY" : card.fine}</p>
                                            <p className="text-sm">🚦 {card.state}</p>
                                        </div>
                                        {card.description.length > 0 ? <p className="px-10 text-sm text-balance line-clamp-2 overflow-hidden whitespace-nowrap">📝 {card.description}</p> : <span></span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h1 className="relative text-2xl text-white font-bold top-[50%] text-center">No tickets found</h1>
                    )}
                </div>
                {hoveredCardIndex !== null && (
                    <Card_hover datas={data} index={hoveredCardIndex} setData={setData} visible={visible} toggleVisibility={closeHoverCard} />
                )}

            </div>
        </>
    );
};

export default CardList;