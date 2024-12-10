import React, { useState, useEffect } from 'react';
import DateSelector from './DateSelector';
import Example from "../components/calendar";

const FilterCardComponent = ({ cards, setData }) => {
    // neeed to fix the xxxxxx problem
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('xxxx-xx-xx');
    const [end, setEnd] = useState('xxxx-xx-xx');
    const [location, setLocation] = useState('');
    const [floor, setFloor] = useState('');
    const [zone, setZone] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
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

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
        setFloor('');
        setZone('');
    };
    const handleFloorChange = (e) => {
        setFloor(e.target.value);
        setZone('');
    };

    const handleZoneChange = (e) => {
        setZone(e.target.value);
    };

    useEffect(() => {

        let nwstart = start;
        let nwend = end;

        if (start == 'xxxx-xx-xx') {
            nwstart = '';

        }

        if (end == 'xxxx-xx-xx') {
            nwend = '';

        }

        if (!title && !nwstart && !nwend && !location && !floor && !zone) {
            setData(cards);
            console.log(cards);
            return;
        }

        const filteredData = cards.filter((card) => {


            return (
                (!nwstart || new Date(card.startdate) >= new Date(nwstart)) &&
                (!nwend || new Date(card.endate) <= new Date(nwend)) &&
                (!location || card.location === location) &&
                (!floor || card.floor === floor) &&
                (!zone || card.zone === zone)
            );
        });

        console.log(filteredData);

        setData(filteredData);

    }, [title, start, end, location, floor, zone]);


    return (
        <div className='text-black *:my-5 flex flex-col justify-around items-center'>
            <input
                type="text"
                placeholder="Filter by title"
                value={title}
                onChange={handleTitleChange}
            />

            <label >
                <p className='text-white'>Start date:</p>
                <DateSelector handleChange={handleStartChange} value={start} />
            </label>

            <label >
                <p className='text-white'>End date:</p>
                <DateSelector handleChange={handleEndChange} value={end} />

            </label>


            <label>
                Location:
                <select onChange={handleLocationChange}>
                    <option className='text-neutral-500' value="">Select Location</option>
                    <option value="active">POVO 2</option>
                    <option value="ITI">ITI</option>
                    <option value="inactive">SCUOLA ECCHER</option>
                    <option value="inactive">UFFICIO TRANSPORTI</option>
                </select>
            </label>

            {location && <label>
                Floor:
                <select onChange={handleFloorChange}>
                    <option className='text-neutral-500' value="">Select Location</option>
                    <option value="active">Ground</option>
                    <option value="inactive">First</option>
                    <option value="inactive">Second</option>
                </select>
            </label>
            }
            {location && floor && <label>
                Zone:
                <select onChange={handleZoneChange}>
                    <option className='text-neutral-500' value="">Select Location</option>
                    <option value="active">POVO 2</option>
                    <option value="inactive">SCUOLA ECCHER</option>
                    <option value="inactive">UFFICIO TRANSPORTI</option>
                </select>
            </label>}

        </div>
    );
};

export default FilterCardComponent;