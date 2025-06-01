import { IOptionType, IServiceOrder } from "@/types/order";
import { EOrderStatus } from "@/types/order";
import { timeMultiplierForBeautification } from "./constants";

export const getOrderStatus = (status: EOrderStatus): string => {
  switch (status) {
    case EOrderStatus.PAID:
      return "En attente";
    case EOrderStatus.FAILED:
      return "Erreur";
    case EOrderStatus.IN_PROGRESS:
      return "En cours";
    case EOrderStatus.CANCELED:
      return "Annulée";
    case EOrderStatus.REFUNDED:
      return "Remboursée";
    case EOrderStatus.DONE:
      return "Terminée";
    case EOrderStatus.PENDING:
      return "Non payée";
    default:
      return "";
  }
};

export const getOrderStatusChipColor = (status: EOrderStatus) => {
  switch (status) {
    case EOrderStatus.PAID:
      return "secondary";
    case EOrderStatus.FAILED:
      return "error";
    case EOrderStatus.IN_PROGRESS:
      return "info";
    case EOrderStatus.CANCELED:
      return "warning";
    case EOrderStatus.REFUNDED:
      return "warning";
    case EOrderStatus.DONE:
      return "default";
    case EOrderStatus.PENDING:
      return "default";
    default:
      return "default";
  }
};

export const getOrderType = (type: IOptionType): string =>
  `${type.proofreading_and_correction ? "Correction" : "Correction et embellissement"}`;

export const getOrderDuration = (service: IServiceOrder): string => {
  const nbrDays = getTotalDays(service);
  return `${nbrDays} jour${nbrDays > 1 ? "s" : ""}`;
};

export const getFormattedDate = (date: Date) =>
  `Le ${date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })} à ${date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

export const calculateDays = (service: IServiceOrder) => {
  let daysTotal;
  if (service.optionDuration.twenty_four_hours) {
    daysTotal = 1;
  } else if (service.optionDuration.two_days) {
    daysTotal = 2;
  } else if (service.optionDuration.three_days) {
    daysTotal = 3;
  } else if (service.optionDuration.one_week) {
    daysTotal = 7;
  } else if (service.optionDuration.two_weeks) {
    daysTotal = 14;
  } else if (service.optionDuration.three_weeks) {
    daysTotal = 21;
  } else {
    throw new Error("Option de délai non prise en charge");
  }
  return Math.ceil(daysTotal);
};

export const getBeautificationDays = (service: IServiceOrder) => {
  const days = calculateDays(service);
  const daysTotal = days * timeMultiplierForBeautification;
  return Math.ceil(daysTotal - days);
};

export const getTotalDays = (service: IServiceOrder) => {
  if (service.optionType.beautification) {
    return calculateDays(service) + getBeautificationDays(service);
  }
  return calculateDays(service);
};
