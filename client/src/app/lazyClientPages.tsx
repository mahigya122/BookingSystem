import { lazy } from "react";

export const ClientDashboard = lazy(() => import("../domains/cabins/explore/ClientDashboard"));
export const ClientProfile = lazy(() => import("../domains/guests/ClientProfile"));
export const Login = lazy(() => import("./LoginWrapper"));
export const CabinDetails = lazy(() => import("../domains/cabins/details/CabinDetails"));
export const MyBookings = lazy(() => import("../domains/bookings/MyBookings"));
export const PaymentSuccess = lazy(() => import("../domains/payments/PaymentSuccess"));
export const PaymentFailure = lazy(() => import("../domains/payments/PaymentFailure"));
export const InfoPage = lazy(() => import("../domains/guests/InfoPage"));
export const GuestMessages = lazy(() => import("../domains/guests/GuestsMessageindex"))