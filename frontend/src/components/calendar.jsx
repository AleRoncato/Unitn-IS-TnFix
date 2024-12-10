
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isEqual,
    isSameDay,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
    startOfWeek,
} from 'date-fns'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState, useRef, useEffect, Fragment } from 'react'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


export default function Example({ meetings, date, setDate }) {

    if (!meetings) {
        meetings = []
    }
    if (date === 'xxxx-xx-xx') {
        date = ''
    }

    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(date || today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())


    const days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    })

    function handleSelectDay(day) {
        setDate(format(day, 'yyyy-MM-dd'))
        setSelectedDay(day)
        const newMonth = format(day, 'MMM-yyyy');
        if (newMonth !== currentMonth) {
            setCurrentMonth(newMonth);
        }
    }

    function nextMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function previousMonth() {
        const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    // let selectedDayMeetings = meetings.filter((meeting) =>
    //     isSameDay(parseISO(meeting.startDatetime), selectedDay)
    // )

    return (
        <div className="p-8 absolute z-[100] bg-neutral-800">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className={`${meetings ? '' : 'md:grid md:grid-cols-2 md:divide-x md:divide-gray-200'}`}>
                    <div className={`${meetings ? '' : 'md:pr-16'}`}>
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-white">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <div

                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-white hover:text-gray-500"
                            >

                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <div
                                onClick={nextMonth}
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-white hover:text-gray-500"
                            >

                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-400">
                            <div>S</div>
                            <div>M</div>
                            <div>T</div>
                            <div>W</div>
                            <div>T</div>
                            <div>F</div>
                            <div>S</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-1.5'
                                    )}
                                >
                                    <div

                                        onClick={() => handleSelectDay(day)}
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',
                                            !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            'text-blue-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-white',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-neutral-600',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-red-500',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-400',
                                            (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-semibold',
                                            'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                        )}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </div>
                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDatetime), day)
                                        ) && (
                                                <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* add conditional ticket visual */}
                </div>
            </div>
        </div>


    )


}


let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

// export function TicketVisual({ meetings }) {

//     return (
//         <section className="mt-12 md:mt-0 md:pl-14">
//             <h2 className="font-semibold text-gray-900">
//                 Schedule for{' '}
//                 <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
//                     {format(selectedDay, 'MMM dd, yyy')}
//                 </time>
//             </h2>
//             <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
//                 {selectedDayMeetings.length > 0 ? (
//                     selectedDayMeetings.map((meeting) => (
//                         <Meeting meeting={meeting} key={meeting.id} />
//                     ))
//                 ) : (
//                     <p>No meetings for today.</p>
//                 )}
//             </ol>
//         </section>
//     )
// }

// function Meeting({ meeting }) {
//     let startDateTime = parseISO(meeting.startDatetime)
//     let endDateTime = parseISO(meeting.endDatetime)
//     return (
//         <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
//             <img
//                 src={meeting.imageUrl}
//                 alt=""
//                 className="flex-none w-10 h-10 rounded-full"
//             />
//             <div className="flex-auto">
//                 <p className="text-gray-900">{meeting.name}</p>
//                 <p className="mt-0.5">
//                     <time dateTime={meeting.startDatetime}>
//                         {format(startDateTime, 'h:mm a')}
//                     </time>{' '}
//                     -{' '}
//                     <time dateTime={meeting.endDatetime}>
//                         {format(endDateTime, 'h:mm a')}
//                     </time>
//                 </p>
//             </div>
//             <Menu
//                 as="div"
//                 className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
//             >
//                 <div>
//                     <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
//                         <span className="sr-only">Open options</span>
//                         <Dot className="w-6 h-6" aria-hidden="true" />
//                     </Menu.Button>
//                 </div>
//                 <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-100"
//                     enterFrom="transform opacity-0 scale-95"
//                     enterTo="transform opacity-100 scale-100"
//                     leave="transition ease-in duration-75"
//                     leaveFrom="transform opacity-100 scale-100"
//                     leaveTo="transform opacity-0 scale-95"
//                 >
//                     <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                         <div className="py-1">
//                             <Menu.Item>
//                                 {({ active }) => (
//                                     <a
//                                         href="#"
//                                         className={classNames(
//                                             active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                             'block px-4 py-2 text-sm'
//                                         )}
//                                     >
//                                         Edit
//                                     </a>
//                                 )}
//                             </Menu.Item>
//                             <Menu.Item>
//                                 {({ active }) => (
//                                     <a
//                                         href="#"
//                                         className={classNames(
//                                             active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
//                                             'block px-4 py-2 text-sm'
//                                         )}
//                                     >
//                                         Cancel
//                                     </a>
//                                 )}
//                             </Menu.Item>
//                         </div>
//                     </Menu.Items>
//                 </Transition>
//             </Menu>
//         </li>
//     )
// }

