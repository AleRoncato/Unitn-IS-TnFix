import React, { useEffect, useState } from 'react';
import Card_hover from './card-hover';
import FilterCardComponent from './FilterCardComponent';

const CardList = () => {


    const cards = [
        {
            "id": 101,
            "title": "Stampante non funzionante",
            "type": "Problema hardware",
            "description": "La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.",
            "location": "Ufficio Amministrativo",
            "zone": "Piano Terra",
            "startdate": "2024-09-01",
            "endate": "2024-09-01",
            "status": "Pending"
        },
        {
            "id": 202,
            "title": "Sostituzione lampadine",
            "type": "Richiesta manutenzione",
            "description": "Richiesta di sostituzione lampadine bruciate nella sala riunioni.",
            "location": "Sala Conferenze",
            "zone": "Secondo Piano",
            "startdate": "2024-08-15",
            "endate": "2024-08-15",
            "status": "In Progress"
        },
        {
            "id": 303,
            "title": "Errore accesso sistema",
            "type": "Problema software",
            "description": "Impossibile accedere al sistema gestionale con le credenziali corrette.",
            "location": "Online",
            "zone": "Reparto Contabilità",
            "startdate": "2024-08-20",
            "endate": "2024-08-20",
            "status": "Resolved"
        },
        {
            "id": 404,
            "title": "Corso di aggiornamento GDPR",
            "type": "Formazione",
            "description": "Sessione di aggiornamento sulle nuove normative GDPR.",
            "location": "Sala Formazione",
            "zone": "Terzo Piano",
            "startdate": "2024-09-10",
            "endate": "2024-09-10",
            "status": "Pending"
        },
        {
            "id": 505,
            "title": "Porta di emergenza bloccata",
            "type": "Problema sicurezza",
            "description": "La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.La porta di emergenza dell'uscita nord non si apre correttamente.",
            "location": "Ufficio HR",
            "zone": "Piano Terra",
            "startdate": "2024-08-05",
            "endate": "2024-08-05",
            "status": "Pending"
        }
    ];

    const [data, setData] = useState(cards);

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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:5000/cards');
    //             const result = await response.json();
    //             setData(result);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <>

            <div className='flex-col'>
                {/* also a component for the filter on the cards */}

                <div className="flex justify-center items-center my-5">
                    <FilterCardComponent cards={data} setData={setData} />
                </div>
                {/* needs to become a component */}

                <div className="h-full mx-12 my-2">
                    {data.map((card, index) => (
                        <div
                            key={index}
                            className={`bg-[#F2E9E4] ring-1 ring-black/5 
                            backdrop-filter backdrop-blur-xl
                            text-neutral-900 p-4 m-2 rounded-2xl cursor-default my-2.5`}
                            onClick={() => handleCardClick(index)}
                        >

                            <div className='flex-col font-mono'>
                                <div className='flex justify-around'>
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl text-red-500 font-extrabold">{card.title} </h2>
                                        <p className="text-md">{card.type}</p>
                                    </div>
                                    <div className='flex-col justify-center items-center'>
                                        <p className="text-md font-bold"> 📍 {card.location}</p>
                                        <p className="pl-5 text-xs"> {card.zone}</p>
                                    </div>
                                </div>

                                <div className='flex justify-around my-3'>
                                    <p className="text-sm">📅 {card.startdate}</p>
                                    <p className="text-sm">📅 {card.endate}</p>
                                    <p className="text-sm">🚦 {card.status}</p>
                                </div>


                                <p className=" px-10 text-sm text-balance line-clamp-2 overflow-hidden whitespace-nowrap">📝 {card.description}</p>
                            </div>

                        </div>
                    ))}
                </div>

                {hoveredCardIndex !== null && (
                    <Card_hover datas={data} index={hoveredCardIndex} setData={setData} visible={visible} toggleVisibility={closeHoverCard} />
                )}


            </div>
        </>
    );
};

export default CardList;