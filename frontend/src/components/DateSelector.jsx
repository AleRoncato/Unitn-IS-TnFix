
import React, { useEffect, useState } from 'react';
import Example from "./calendar";
import { ArrowBigDown, ArrowBigDownDashIcon, Calendar } from "lucide-react";




const DateSelector = ({ handleChange, value }) => {

    /// parte per date picker 
    const [show, setShow] = useState(false)
    const [date, setDate] = useState(value)

    useEffect(() => {
        handleChange(date)
    }, [date])

    return (
        <div>

            <div onClick={(e) => (setShow((prev) => !prev))} className="flex justify-center items-center bg-neutral-700 p-3 rounded-2xl ">
                <p className="text-md font-thin mr-2  text-neutral-400">{date == 'xxxx-xx-xx' ? 'YYYY-MM-DD' : date}</p>
                <Calendar className="h-5 text-white" />

            </div>

            {show && <Example meetings={[]} date={date} setDate={setDate} />}
        </div>
    );
};

export default DateSelector;