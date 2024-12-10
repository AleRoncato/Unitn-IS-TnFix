import { ArrowBigLeftDashIcon, ArrowBigRightDash } from "lucide-react";

const options = {
    title: "Start Date",
    autoHide: true,
    todayBtn: true,
    todayBtnText: "Oggi",
    clearBtn: true,
    clearBtnText: "Reset",
    maxDate: new Date("2050-01-01"),
    minDate: new Date("2000-01-01"),
    theme: {
        background: " dark:bg-neutral-800",
        todayBtn: "dark:bg-red-500",
        clearBtn: "dark:bg-neutral-700",
        icons: "dark:bg-neutral-700",
        text: "dark:text-neutral-100", // text color for normal dates
        disabledText: "dark:text-neutral-600  ", // text color for disabled dates
        input: "",
        inputIcon: "",
        selected: "dark:bg-red-500", // background color for selected dates
    },
    icons: {
        // () => ReactElement | JSX.Element
        prev: () => <ArrowBigLeftDashIcon size={24} />,
        next: () => <ArrowBigRightDash size={24}/>,
    },
    datepickerClassNames: "top-12",
    language: "Italian",
    disabledDates: [],
    weekDays: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
    inputNameProp: "date",
    inputIdProp: "date",
    inputPlaceholderProp: "Select Date",
    inputDateFormatProp: {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
}

export default options;