const TicketControls = ({datas, index, setData}) => {

    const data = datas[index];

    return (
        <div className="flex justify-between">
            <div className="flex items-center">
                <p className="text-sm">Start Date:</p>
                <input
                    type="date"
                    className="mt-1 block text-black w-full ml-2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={data.startdate ? data.startdate : ""}
                    onChange={(e) => {
                        const nextShapes = datas.map((data, ind) => {
                            if (ind === index) {
                                return { ...data, startdate: e.target.value };
                            }
                            return data;
                        });
                        setData(nextShapes);
                    }}
                />
            </div>
            <div className="flex items-center">
                <p className="text-sm">End Date:</p>
                <input
                    type="date"
                    className="mt-1 block text-black w-full ml-2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={data.endate ? data.endate : ""}
                    onChange={(e) => {
                        const nextShapes = datas.map((data, ind) => {
                            if (ind === index) {
                                return { ...data, endate: e.target.value };
                            }
                            return data;
                        });
                        setData(nextShapes);
                    }}
                />
            </div>
            <div className="flex items-center">
                <p className="text-sm">Status: </p>
                <br />
                <select
                    id="status"
                    name="status"
                    className="mt-1 block text-black w-full ml-2 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={data.status}
                    onChange={(e) => {
                        const nextShapes = datas.map((data, ind) => {
                            if (ind === index) {
                                return { ...data, status: e.target.value };
                            }
                            return data;
                        });
                        setData(nextShapes);
                    }}
                >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default TicketControls;