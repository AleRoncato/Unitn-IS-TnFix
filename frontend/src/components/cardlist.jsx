import React, { useState } from 'react';
import Card_hover from './card-hover';

const CardList = ({ cards }) => {
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

    return (
        <>
            <div className="h-full mx-12 my-2">
                {cards.map((card, index) => (
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
                        <p className="text-sm">{card.date}</p>
                    </div>
                ))}
            </div>

            {hoveredCardIndex !== null && (
                <Card_hover visible={visible} data={cards[hoveredCardIndex]} toggleVisibility={closeHoverCard} />
            )}
        </>
    );
};

export default CardList;