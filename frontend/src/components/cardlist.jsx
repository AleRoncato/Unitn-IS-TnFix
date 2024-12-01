import React, { useState } from 'react';
import Card_hover from './card-hover';

const CardList = () => {
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    const [visible, setVisible] = useState(false);

    const cards = [
        { id: 1, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", startdate: "2023-10-20", endate: "", status: "Pending" },
        { id: 2, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", startdate: "2023-10-20", endate: "2023-10-20", status: "Pending" },
        { id: 7, title: "React Hooks", type: "Webinar", description: "Master the use of hooks in React.", location: "Online", startdate: "2023-10-20", endate: "2023-10-20", status: "Pending" }
    ];

    const [data, setData] = useState(cards);


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

    return (
        <>
            <div className="h-full mx-12 my-2">
                {data.map((card, index) => (
                    <div
                        key={index}
                        className={`bg-[#F2E9E4] ring-1 ring-black/5 
                            backdrop-filter backdrop-blur-xl
                            text-neutral-900 p-4 m-2 rounded-2xl cursor-pointer my-2.5`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">{card.title}</h2>
                            <p className="text-sm">{card.type}</p>
                        </div>
                        <p className="text-sm">{card.description}</p>
                        <p className="text-sm">{card.location}</p>
                        <p className="text-sm">{card.status}</p>
                    </div>
                ))}
            </div>

            {hoveredCardIndex !== null && (
                <Card_hover datas={data} index={hoveredCardIndex} setData={setData} visible={visible} toggleVisibility={closeHoverCard} />
            )}
        </>
    );
};

export default CardList;