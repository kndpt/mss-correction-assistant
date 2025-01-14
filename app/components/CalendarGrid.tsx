import { IOrder } from "@/types/order";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  isWithinInterval,
  addDays,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarEvent } from "./CalendarEvent";

interface CalendarGridProps {
  currentDate: Date;
  orders: IOrder[];
  onDateClick?: (date: Date) => void;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

interface EventPosition {
  startX: number;
  width: number;
  row: number;
  verticalIndex: number;
  order: IOrder;
  isStart: boolean;
  isEnd: boolean;
  shouldShowTitle: boolean;
  height: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, orders, onDateClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });
  const allDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Hauteur maximale disponible pour les événements dans une cellule (en pixels)
  const MAX_CELL_HEIGHT = 100; // Hauteur approximative de la cellule moins les marges
  // Hauteur minimale d'un événement compressé (en pixels)
  const MIN_EVENT_HEIGHT = 18;
  // Hauteur standard d'un événement (en pixels)
  const STANDARD_EVENT_HEIGHT = 28;
  // Espace entre les événements (en pixels)
  const EVENT_SPACING = 4;

  // Calculer les positions des événements
  const getEventPositions = (): EventPosition[] => {
    // Compter le nombre d'événements par jour
    const eventCountByDay: { [key: string]: number } = {};

    // Première passe : compter les événements par jour
    orders
      .filter((order) => {
        const startDate = order.purchaseTimestamp?.toDate();
        const endDate = order.endDate?.toDate();
        return (
          startDate &&
          endDate &&
          isWithinInterval(startDate, { start: calendarStart, end: calendarEnd })
        );
      })
      .forEach((order) => {
        const startDate = order.purchaseTimestamp!.toDate();
        const endDate = order.endDate!.toDate();

        // S'assurer que les dates sont dans les limites du calendrier
        const effectiveStartDate = startDate < calendarStart ? calendarStart : startDate;
        const adjustedEndDate = addDays(endDate, 1);
        const effectiveEndDate = adjustedEndDate > calendarEnd ? calendarEnd : adjustedEndDate;

        // Compter chaque jour de l'événement
        let checkDate = new Date(effectiveStartDate);
        while (checkDate <= effectiveEndDate) {
          const daysSinceStart = differenceInDays(checkDate, calendarStart);
          const row = Math.floor(daysSinceStart / 7);
          const col = daysSinceStart % 7;
          const dateKey = `${row}-${col}`;

          if (!eventCountByDay[dateKey]) {
            eventCountByDay[dateKey] = 0;
          }
          eventCountByDay[dateKey]++;

          checkDate = addDays(checkDate, 1);
        }
      });

    // Calculer la hauteur des événements en fonction du nombre par jour
    const getEventHeight = (dateKey: string): number => {
      const count = eventCountByDay[dateKey] || 0;
      if (count === 0) return STANDARD_EVENT_HEIGHT;

      // Calculer la hauteur disponible par événement
      const availableHeight = MAX_CELL_HEIGHT / count - EVENT_SPACING;
      // Limiter à la hauteur minimale
      return Math.max(MIN_EVENT_HEIGHT, Math.min(availableHeight, STANDARD_EVENT_HEIGHT));
    };

    const positions: EventPosition[] = [];
    const eventsByDay: { [key: string]: number[] } = {}; // Pour suivre les événements par jour

    orders
      .filter((order) => {
        const startDate = order.purchaseTimestamp?.toDate();
        const endDate = order.endDate?.toDate();
        return (
          startDate &&
          endDate &&
          isWithinInterval(startDate, { start: calendarStart, end: calendarEnd })
        );
      })
      .sort((a, b) => {
        // Trier par date de début
        const aStart = a.purchaseTimestamp!.toDate();
        const bStart = b.purchaseTimestamp!.toDate();
        return aStart.getTime() - bStart.getTime();
      })
      .forEach((order) => {
        const startDate = order.purchaseTimestamp!.toDate();
        const endDate = order.endDate!.toDate();

        // S'assurer que les dates sont dans les limites du calendrier
        const effectiveStartDate = startDate < calendarStart ? calendarStart : startDate;
        const adjustedEndDate = addDays(endDate, 1);
        const effectiveEndDate = adjustedEndDate > calendarEnd ? calendarEnd : adjustedEndDate;

        // Calculer le nombre total de jours
        const totalDays = differenceInDays(effectiveEndDate, effectiveStartDate) + 1;
        let remainingDays = totalDays;
        let currentDate = effectiveStartDate;

        // Trouver l'index vertical disponible pour tout l'événement
        let maxVerticalIndex = 0;

        // Vérifier chaque jour de l'événement
        let checkDate = new Date(effectiveStartDate);
        while (checkDate <= effectiveEndDate) {
          const daysSinceStart = differenceInDays(checkDate, calendarStart);
          const row = Math.floor(daysSinceStart / 7);
          const col = daysSinceStart % 7;
          const dateKey = `${row}-${col}`;

          if (!eventsByDay[dateKey]) {
            eventsByDay[dateKey] = [];
          }

          // Trouver le premier index vertical disponible
          let verticalIndex = 0;
          while (eventsByDay[dateKey].includes(verticalIndex)) {
            verticalIndex++;
          }

          maxVerticalIndex = Math.max(maxVerticalIndex, verticalIndex);
          checkDate = addDays(checkDate, 1);
        }

        // Créer un segment pour chaque semaine
        while (remainingDays > 0) {
          const daysSinceStart = differenceInDays(currentDate, calendarStart);
          const startX = daysSinceStart % 7;
          const row = Math.floor(daysSinceStart / 7);

          // Calculer la largeur du segment (limitée à la fin de la semaine)
          const daysUntilWeekEnd = 7 - startX;
          const segmentWidth = Math.min(remainingDays, daysUntilWeekEnd);
          const segmentEnd = addDays(currentDate, segmentWidth - 1);

          // Marquer tous les jours de ce segment comme occupés
          for (let i = 0; i < segmentWidth; i++) {
            const dateKey = `${row}-${(startX + i) % 7}`;
            if (!eventsByDay[dateKey]) {
              eventsByDay[dateKey] = [];
            }
            eventsByDay[dateKey].push(maxVerticalIndex);
          }

          // Calculer la hauteur de l'événement pour ce segment
          // Utiliser la hauteur la plus petite parmi tous les jours du segment
          let minHeight = STANDARD_EVENT_HEIGHT;
          for (let i = 0; i < segmentWidth; i++) {
            const dateKey = `${row}-${(startX + i) % 7}`;
            const height = getEventHeight(dateKey);
            minHeight = Math.min(minHeight, height);
          }

          positions.push({
            startX,
            width: segmentWidth,
            row,
            verticalIndex: maxVerticalIndex,
            order,
            isStart: currentDate.getTime() === startDate.getTime(),
            isEnd: segmentEnd.getTime() === endDate.getTime(),
            shouldShowTitle: currentDate.getTime() === startDate.getTime() || startX === 0,
            height: minHeight, // Ajouter la hauteur calculée
          });

          // Passer à la semaine suivante
          remainingDays -= segmentWidth;
          currentDate = addDays(currentDate, segmentWidth);
        }
      });

    return positions;
  };

  const eventPositions = getEventPositions();

  return (
    <div className="border border-indigo-200 rounded-xl">
      <div className="grid grid-cols-7 rounded-t-3xl border-b border-indigo-200">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={`py-3.5 ${index < 6 ? "border-r" : ""} ${
              index === 0 ? "rounded-tl-xl" : ""
            } ${
              index === 6 ? "rounded-tr-xl" : ""
            } border-indigo-200 bg-indigo-50 flex items-center justify-center text-sm font-medium text-indigo-600`}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 rounded-b-xl relative">
        {/* Grille des jours */}
        {allDays.map((date, index) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isTodayDate = isToday(date);

          return (
            <div
              key={date.toISOString()}
              onClick={() => onDateClick?.(date)}
              className={`h-32 p-2 relative
                ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                ${index % 7 !== 6 ? "border-r" : ""}
                ${index < allDays.length - 7 ? "border-b" : ""}
                ${index === allDays.length - 7 ? "rounded-bl-xl" : ""}
                ${index === allDays.length - 1 ? "rounded-br-xl" : ""}
                border-indigo-200 transition-all duration-300 hover:bg-indigo-50 cursor-pointer`}
            >
              <div className="flex items-center gap-1">
                {isTodayDate ? (
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-6 h-6 rounded-full bg-red-500"></div>
                    <span className="relative text-xs font-semibold text-white z-10">
                      {format(date, "d")}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`text-xs font-semibold ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {format(date, "d")}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {eventPositions.map((eventPosition) => (
          <CalendarEvent
            key={`${eventPosition.order.id}-${eventPosition.row}-${eventPosition.startX}`}
            order={eventPosition.order}
            isStart={eventPosition.isStart}
            isEnd={eventPosition.isEnd}
            shouldShowTitle={eventPosition.shouldShowTitle}
            style={{
              position: "absolute",
              left: `calc(${eventPosition.startX * (100 / 7)}% + 8px)`,
              top: `calc(${
                eventPosition.row * 128 +
                32 +
                eventPosition.verticalIndex * (eventPosition.height + EVENT_SPACING)
              }px)`,
              width: `calc(${eventPosition.width * (100 / 7)}% - 16px)`,
              height: `${eventPosition.height}px`,
              fontSize: eventPosition.height < 20 ? "10px" : "12px",
              overflow: "hidden",
            }}
          />
        ))}
      </div>
    </div>
  );
};
