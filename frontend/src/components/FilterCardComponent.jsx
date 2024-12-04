import React, { useState } from 'react';

const FilterCardComponent = ({ cards, setData }) => {
    const [filter, setFilter] = useState('');
    const [location, setLocation] = useState('');

    const handleTitleChange = (e) => {
        setFilter(e.target.value);
    };

    const handleStartChange = (e) => {
        setFilter(e.target.value);
    };

    const handleEndChange = (e) => {
        setFilter(e.target.value);
    };
    const handleStatusChange = (e) => {
        setFilter(e.target.value);
    };
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };
    const handleZoneChange = (e) => {
        setFilter(e.target.value);
    };


    return (
        <div className='text-black'>
            <input
                type="text"
                placeholder="Filter by title"
                value={filter}
                onChange={handleTitleChange}
            />
            <div>
                <label>
                    Start date:
                    <input type="date" />
                </label>
                <label>
                    End date:
                    <input type="date" />
                </label>
                <label>
                    Status:
                    <select>
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </label>
                <label>
                    Location:
                    <select onChange={handleLocationChange}>
                        <option className='text-neutral-500' value="">Select Location</option>
                        <option value="active">POVO 2</option>
                        <option value="inactive">SCUOLA ECCHER</option>
                        <option value="inactive">UFFICIO TRANSPORTI</option>
                    </select>
                </label>
                {location && <label>
                    Zone:
                    <select onChange={handleZoneChange}>
                        <option className='text-neutral-500' value="">Select Location</option>
                        <option value="active">POVO 2</option>
                        <option value="inactive">SCUOLA ECCHER</option>
                        <option value="inactive">UFFICIO TRANSPORTI</option>
                    </select>
                </label>}

            </div>

        </div>
    );
};

export default FilterCardComponent;