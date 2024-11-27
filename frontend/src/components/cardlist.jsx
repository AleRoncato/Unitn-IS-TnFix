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
            <div className="card-list bg-neutral-700 h-full">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className={`card ${hoveredCardIndex === index ? 'hovered' : ''} text-black`}
                        onClick={() => handleCardClick(index)}
                    >
                        <h2>{card.title}</h2>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>

            <Card_hover visible={visible} data={cards[hoveredCardIndex]} toggleVisibility={closeHoverCard} />
        </>
    );
};

export default CardList;