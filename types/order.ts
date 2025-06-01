// ----------------------------------------------------------------------

import { Timestamp } from "firebase/firestore";

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date;
  paymentTime: Date;
  deliveryTime: Date;
  completionTime: Date;
  timeline: {
    title: string;
    time: Date;
  }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subTotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  history: IOrderHistory;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  items: IOrderProductItem[];
  createdAt: Date;
};

// ----------------------------------------------------------------------

/* 
export interface IOrder {
  email: string;
  endDate: Timestamp;
  filePath: string;
  intent: string;
  purchaseTimestamp: Timestamp;
  sessionId: string;
  status: EOrderStatus;
  userId: string;
  timeline: ITimelineItem[];
  service: IServiceOrder;
  displayName: string;
  fixedFilePath: string;
}

export interface IServiceOrder {
  uploadedFile: IFile;
  wordsValue: number;
  price: number;
  optionDuration: IOptionDuration;
  optionType: IOptionType;
  informations: string;
  title: string;
}

export interface ITimelineItem {
  title: string;
  description: string;
  color: string;
  icon: string;
}


export interface IFile {
  file: File | null;
  name: string;
}

*/

// convert interfaces to types

export type IOrder = {
  id?: string;
  email: string;
  endDate: Timestamp;
  filePath: string;
  intent: string;
  purchaseTimestamp: Timestamp;
  sessionId: string;
  status: EOrderStatus;
  userId: string;
  timeline: ITimelineItem[];
  service: IServiceOrder;
  displayName: string;
  fixedFilePath?: string;
};

export enum EOrderStatus {
  PENDING = "pending",
  PAID = "paid",
  IN_PROGRESS = "in_progress",
  CANCELED = "canceled",
  REFUNDED = "refunded",
  FAILED = "failed",
  DONE = "done",
}

export interface IServiceOrder {
  text?: string;
  uploadedFile: IFile;
  wordsValue: number;
  price: number;
  optionDuration: IOptionDuration;
  optionType: IOptionType;
  informations: string;
  title: string;
}

export interface ITimelineItem {
  title: string;
  description: string;
  createdAt: Timestamp;
}

export interface IFile {
  file: File | null;
  name: string;
}

export interface IOptionDurationLimits {
  twenty_four_hours: number;
  two_days: number;
  three_days: number;
  one_week: number;
  two_weeks: number;
  three_weeks: boolean;
}

export interface IOptionDuration {
  twenty_four_hours: boolean;
  two_days: boolean;
  three_days: boolean;
  one_week: boolean;
  two_weeks: boolean;
  three_weeks: boolean;
}

export interface TDurationOption {
  id: keyof IOptionDuration;
  name: string;
}

export interface IOptionType {
  proofreading_and_correction: boolean;
  beautification: boolean;
}

export interface TDurationType {
  id: keyof IOptionType;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
}

export interface IMessageOrder {
  sender: string;
  content: string;
  timestamp: Timestamp;
}
