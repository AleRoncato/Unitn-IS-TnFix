import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AddPage = () => {
    const [title, setTitle] = useState(''); // Add title state
    const [type, setType] = useState(''); // Add type state

    const [building, setBuilding] = useState(''); // Add building state
    const [room, setRoom] = useState('');   // Add room state
    const [floor, setFloor] = useState(''); // Add floor state

    const [description, setDescription] = useState(''); // Add description state
    const [image, setImage] = useState(''); // Add image state

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(title, type, building, floor, room, description, image);
        if (!title || !type || !building || !room || !floor) {
            alert('Please fill all necessary fields');
            return;
        }
        // Send formData to backend using Axios
        axios.post('http://localhost:5000/tickets', {
            title: title,
            type: type,
            building: building,
            floor: floor,
            room: room,
            description: description,
            image: []

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('Token')}` // Send JWT token
            }
        })
            .then((response) => {
                console.log(response.data);
                alert('Ticket created successfully');
                navigate('/home');
                // Redirect to the home page
            })
            .catch((error) => {
                console.error(error);
                alert('An error occurred. Please try again later');
            });
    };

    return (

        <div className="inset-[5%] absolute overflow-hidden bg-white bg-opacity-10 rounded-lg shadow-lg backdrop-blur-sm border border-white border-opacity-30 text-white p-4">
            <div className='flex-col h-full justify items-center'>

                <div className="absolute top-5 right-5 cursor-pointer">
                    <Link to="/home">
                        <X className="h-10 w-10 text-white" size={32} />
                    </Link>
                </div>
                <form onSubmit={handleSubmit} className=" *:mx-[10%] font-mono font-medium text-lg grid grid-cols-2 gap-4 h-full">
                    <h1 className=" special-font hero-heading flex-center mx-0 my-8 col-span-2"><b>Create Ticket</b></h1>
                    <div className="col-span-2">
                        <label htmlFor="title" className="block mb-1">Title: (*)</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            className="w-full p-2 bg-neutral-600 rounded"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="type" className="block mb-1">Tipologia:</label>
                        <select
                            id="type"
                            value={type}
                            className={`w-full p-2 bg-neutral-600 rounded ${type === '' ? 'text-neutral-500' : ''}`}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option className="text-neutral-500" value="">Seleziona una tipologia</option>
                            <option className="text-white" value="Electrical">Electrical</option>
                            <option className="text-white" value="Plumbing">Plumbing</option>
                            <option className="text-white" value="Heating">Heating</option>
                            <option className="text-white" value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="building" className="block mb-1">Building:</label>
                        <select
                            id="building"
                            value={building}
                            className={`w-full p-2 bg-neutral-600 rounded ${building === '' ? 'text-neutral-500' : ''}`}
                            onChange={(e) => setBuilding(e.target.value)}
                        >
                            <option className="text-neutral-500" value="">Seleziona un Edificio</option>
                            <option className="text-white" value="Electrical">Scuola</option>
                            <option className="text-white" value="Plumbing">Comune</option>
                            <option className="text-white" value="Heating">Stabilimento</option>
                            <option className="text-white" value="Other">Other</option>
                        </select>
                    </div>
                    <div className=''>
                        <label htmlFor="floor" className="block mb-1">Floor:</label>
                        <select
                            id="floor"
                            value={floor}
                            className={`w-full p-2 bg-neutral-600 rounded ${floor === '' ? 'text-neutral-500' : ''}`}
                            onChange={(e) => setFloor(e.target.value)}
                        >
                            <option className="text-neutral-500" value="">Seleziona un Piano</option>
                            <option className="text-white" value="Ground">Ground</option>
                            <option className="text-white" value="First">First</option>
                            <option className="text-white" value="Second">Second</option>
                            <option className="text-white" value="Other">Other</option>
                        </select>
                    </div>
                    <div className='mx-[10%]'>
                        <label htmlFor="room" className="block mb-1">Room:</label>
                        <select
                            id="room"
                            value={room}
                            className={`w-full p-2 bg-neutral-600 rounded ${room === '' ? 'text-neutral-500' : ''}`}
                            onChange={(e) => setRoom(e.target.value)}
                        >
                            <option className="text-neutral-500" value="">Seleziona una Stanza</option>
                            <option className="text-white" value="101">101</option>
                            <option className="text-white" value="102">102</option>
                            <option className="text-white" value="103">103</option>
                            <option className="text-white" value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-span-2 mx-[10%]">
                        <label htmlFor="image" className="block mb-1">Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept='image/*'
                            className="w-full bg-none file:mr-8 bg-neutral-600 rounded file:bg-neutral-700 hover:file:bg-neutral-800 file:rounded file:text-white file:cursor-pointer file:p-2 file:border-none "
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="col-span-2 mx-[10%]">
                        <label htmlFor="description" className="block mb-1">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            className="w-full p-2 bg-neutral-600 rounded  "
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="col-span-2 flex-center">
                        <button type="submit" className="px-5 py-3 font-bold text-xl bg-red-400 rounded-xl text-white hover:bg-red-600 transition duration-300">Crea Ticket</button>
                    </div>
                </form>
            </div>
        </div>


    );
};

export default AddPage;