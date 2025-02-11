import React, { useState, useEffect } from 'react';
import DateSelector from './DateSelector';
import axios from 'axios';

const FilterCardComponent = ({ cards, setData }) => {
    // neeed to fix the xxxxxx problem
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [start, setStart] = useState('xxxx-xx-xx');
    const [end, setEnd] = useState('xxxx-xx-xx');
    const [building, setbuilding] = useState('');
    const [floor, setFloor] = useState('');
    const [zone, setZone] = useState('');

    const [buildingOptions, setbuildingOptions] = useState([]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);

    };

    const handleStartChange = (date) => {
        setStart(date);
        if (end != 'xxxx-xx-xx' && start > end) {
            setEnd(date);
        }
    };

    const handleEndChange = (date) => {
        setEnd(date);
        if (start != 'xxxx-xx-xx' && end < start) {
            setStart(date);
        }
    };

    const handlebuildingChange = (e) => {
        setbuilding(e.target.value);
        setFloor('');
        setZone('');
        console.log(floor);
        console.log(zone);
    };
    const handleFloorChange = (e) => {
        setFloor(e.target.value);
        setZone('');
    };

    const handleZoneChange = (e) => {
        setZone(e.target.value);
    };

    useEffect(() => {

        console.log(type);

        let nwstart = start;
        let nwend = end;

        if (start == 'xxxx-xx-xx') {
            nwstart = '';

        }

        if (end == 'xxxx-xx-xx') {
            nwend = '';

        }

        if (!title && !type && !nwstart && !nwend && !building && !floor && !zone) {
            setData(cards);
            return;
        }

        const filteredData = cards.filter((card) => {


            return (
                (!title || card.title.toLowerCase().includes(title.toLowerCase())) &&
                (!type || card.type === type) &&
                (!nwstart || new Date(card.startdate) >= new Date(nwstart)) &&
                (!nwend || new Date(card.endate) <= new Date(nwend)) &&
                (!building || card.building === building) &&
                (!floor || card.floor === floor) &&
                (!zone || card.zone === zone)
            );
        });

        console.log(filteredData);

        setData(filteredData);

    }, [title, type, start, end, building, floor, zone]);

    useEffect(() => {
        axios.get('http://localhost:5000/places', {
            headers: {
                accept: 'application/json',
            },
        })
            .then((response) => {
                setbuildingOptions(response.data);

            })
            .catch((error) => {
                console.error(error);
                alert('An error occurred. Please try again later');
            });


    }, []);


    return (
        <div className='text-black *:my-5 ml-5 *:font-mono flex flex-col justify-around items-center'>
            <div className='flex flex-col justify-around'>
                <p className='text-white font-bold'>Titolo:</p>
                <input
                    type="text"
                    placeholder="es: Lampadina rotta"
                    value={title}
                    className='border bg-neutral-700 border-none rounded-md p-1 text-neutral-200'
                    onChange={handleTitleChange}
                />
            </div>

            <label>
                <p className='text-white font-bold'>Tipologia:</p>
                <select onChange={handleTypeChange} value={type} className={'bg-neutral-700 border-none rounded-md p-1 text-neutral-200'}>
                    <option className='text-neutral-400' value="">Select Tipologia</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                </select>
            </label>

            <label >
                <p className='text-white font-bold'>Data Inizio:</p>
                <DateSelector handleChange={handleStartChange} value={start} />
            </label>

            <label >
                <p className='text-white font-bold'>Data Fine:</p>
                <DateSelector handleChange={handleEndChange} value={end} />

            </label>


            <label>
                <p className='text-white font-bold'>Edificio:</p>

                <select onChange={handlebuildingChange} value={building} className='bg-neutral-700 border-none rounded-md p-1 text-neutral-200'>
                    <option className='text-neutral-500' value="">Select building</option>
                    {buildingOptions.map((building, index) => (
                        <option key={index} value={building.name}>{building.name}</option>
                    ))}
                </select>
            </label>

            {building && <label>
                <p className='text-white font-bold'>Piano:</p>

                <select onChange={handleFloorChange} value={floor} className='bg-neutral-700 border-none rounded-md p-1 text-neutral-200'>
                    <option className='text-neutral-500' value="">Select Piano</option>
                    {buildingOptions
                        .find(b => b.name === building)?.floors.map((floor, index) => (
                            <option key={index} value={floor.floor}>{floor.floor}</option>
                        ))}
                </select>
            </label>
            }
            {building && floor && <label>
                <p className='text-white font-bold'>Zona:</p>

                <select onChange={handleZoneChange} value={zone} className='bg-neutral-700 border-none rounded-md p-1 text-neutral-200'>
                    <option className='text-neutral-500' value="">Select Zona</option>
                    {buildingOptions
                        .find(b => b.name === building)?.floors.find(f => f.floor === floor)?.rooms.map((zone, index) => (
                            <option key={index} value={zone}>{zone}</option>
                        ))}
                </select>
            </label>}

        </div>
    );
};

export default FilterCardComponent;