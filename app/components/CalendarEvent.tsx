import { IOrder, EOrderStatus } from "@/types/order";

interface CalendarEventProps {
  order: IOrder;
  style?: React.CSSProperties;
  isStart?: boolean;
  isEnd?: boolean;
  shouldShowTitle?: boolean;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({
  order,
  style,
  isStart = true,
  isEnd = true,
  shouldShowTitle = false,
}) => {
  const getColorClass = (status: EOrderStatus) => {
    switch (status) {
      case EOrderStatus.PENDING:
        return "bg-yellow-50 text-yellow-600";
      case EOrderStatus.IN_PROGRESS:
        return "bg-green-50 text-green-600";
      case EOrderStatus.DONE:
        return "bg-gray-50 text-gray-600";
      default:
        return "bg-purple-50 text-purple-600";
    }
  };

  const startDate = order.purchaseTimestamp?.toDate();
  const endDate = order.endDate?.toDate();

  if (!startDate || !endDate) {
    return null;
  }

  return (
    <div
      className={`p-1 h-6 rounded ${getColorClass(
        order.status
      )} z-10 shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{
        ...style,
        borderRadius: `${isStart ? "0.375rem" : "0"} ${isEnd ? "0.375rem" : "0"} ${
          isEnd ? "0.375rem" : "0"
        } ${isStart ? "0.375rem" : "0"}`,
      }}
    >
      {shouldShowTitle && (
        <p
          className="font-medium truncate flex items-center"
          style={{
            fontSize: "0.65rem",
          }}
        >
          {order.displayName}
        </p>
      )}
    </div>
  );
};
