import { IOrder } from "@/types/order";
import { format, addMonths } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { CalendarGrid } from "./CalendarGrid";
import { UpcomingEvents } from "./UpcomingEvents";

interface CalendarHeaderProps {
  currentDate: Date;
  onDateChange: (direction: "prev" | "next") => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onDateChange }) => (
  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
    <div className="flex items-center gap-4">
      <h5 className="text-xl leading-8 font-semibold text-gray-900">
        {format(currentDate, "MMMM yyyy", { locale: fr })}
      </h5>
      <div className="flex items-center">
        <button
          onClick={() => onDateChange("prev")}
          className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10.0002 11.9999L6 7.99971L10.0025 3.99719"
              stroke="currentcolor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
        <button
          onClick={() => onDateChange("next")}
          className="text-indigo-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6.00236 3.99707L10.0025 7.99723L6 11.9998"
              stroke="currentcolor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
);

interface AgendaProps {
  orders: IOrder[];
}

const Agenda: React.FC<AgendaProps> = ({ orders }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateChange = (direction: "prev" | "next") => {
    const newDate = addMonths(currentDate, direction === "next" ? 1 : -1);
    setCurrentDate(newDate);
  };

  return (
    <section className="relative">
      <div className="w-full max-w-7xl mx-auto px-2 lg:px-8">
        <div className="grid grid-cols-12 gap-8 max-w-4xl mx-auto xl:max-w-full">
          <div className="col-span-12 xl:col-span-5">
            <h2 className="font-manrope text-3xl leading-tight text-gray-900 mb-1.5">
              Livraisons à venir
            </h2>
            <p className="text-lg font-normal text-gray-600 mb-8">Bon courage 💪</p>
            <UpcomingEvents orders={orders} />
          </div>
          <div className="col-span-12 xl:col-span-7 px-2.5 py-5 sm:p-8 bg-gradient-to-b from-white/25 to-white xl:bg-white rounded-2xl">
            <CalendarHeader currentDate={currentDate} onDateChange={handleDateChange} />
            <CalendarGrid currentDate={currentDate} orders={orders} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
