import { IOrder, EOrderStatus } from "@/types/order";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TruckIcon } from "@heroicons/react/24/outline";
import { getOrderDuration } from "@/utils/order";

interface UpcomingEventProps {
  order: IOrder;
}

const UpcomingEvent: React.FC<UpcomingEventProps> = ({ order }) => {
  const startDate = order.purchaseTimestamp?.toDate();
  const endDate = order.endDate?.toDate();

  if (!startDate || !endDate) {
    return null;
  }

  const today = new Date();
  const daysUntilDelivery = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calcul du pourcentage de temps restant
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const percentageRemaining = (daysUntilDelivery / totalDays) * 100;

  // Détermination de la couleur en fonction du pourcentage restant
  const getTimeRemainingColorClass = () => {
    if (percentageRemaining > 60) {
      return "bg-blue-600"; // Bleu quand il reste plus de 60% du temps
    } else if (percentageRemaining > 10) {
      return "bg-orange-500"; // Orange quand il reste entre 10% et 60% du temps
    } else {
      return "bg-red-600"; // Rouge quand il reste moins de 10% du temps
    }
  };

  const handleClick = async () => {
    try {
      // await open(`https://msscorrection.fr/dashboard/order/${order.intent}/`);
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="block p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${getTimeRemainingColorClass()}`}></span>
          <TruckIcon className="w-5 h-5 text-gray-700" />
          <p className="text-base font-medium text-gray-900">
            {format(endDate, "PP", { locale: fr })} (dans {daysUntilDelivery} jours)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h6 className="text-xl leading-8 font-semibold text-black">
          {order.displayName} ({order.service.price}€)
        </h6>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <p className="text-base font-medium text-gray-700">{order.service.title}</p>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-600">
          Type:{" "}
          {order.service.optionType.proofreading_and_correction ? "Correction" : "Beautification"}
        </p>
        <p className="text-sm font-medium text-gray-600">
          Durée:{" "}
          {/* {getDurationInFrench(
            Object.entries(order.service.optionDuration)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .find(([_, value]) => value)?.[0] || ""
          )} */}
          {getOrderDuration(order.service)}
        </p>
        <p className="text-sm font-medium text-gray-600">Mots: {order.service.wordsValue}</p>
      </div>
    </div>
  );
};

interface UpcomingEventsProps {
  orders: IOrder[];
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ orders }) => {
  const upcomingOrders = orders
    .filter((order) => {
      try {
        const startDate = order.purchaseTimestamp?.toDate();
        const endDate = order.endDate?.toDate();
        const now = new Date();
        return (
          startDate &&
          endDate &&
          (order.status === EOrderStatus.PENDING || order.status === EOrderStatus.IN_PROGRESS) &&
          endDate >= now
        );
      } catch (error) {
        console.error("Error with order dates:", error);
        return false;
      }
    })
    .sort((a, b) => {
      const aEndDate = a.endDate!.toDate();
      const bEndDate = b.endDate!.toDate();
      return aEndDate.getTime() - bEndDate.getTime();
    })
    .slice(0, 5);

  return (
    <div className="flex gap-5 flex-col">
      {upcomingOrders.map((order) => (
        <UpcomingEvent key={order.id} order={order} />
      ))}
    </div>
  );
};
