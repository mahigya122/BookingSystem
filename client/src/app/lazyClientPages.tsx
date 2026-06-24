import { lazy } from "react";

export const ClientDashboard = lazy(() => import("../domains/cabins/pages/CabinDetails/explorepage/ClientDashboard"));
export const ClientProfile = lazy(() => import("../domains/guests/pages/ClientProfile"));
export const Login = lazy(() => import("./LoginWrapper"));
export const CabinDetails = lazy(() => import("../domains/cabins/pages/CabinDetails/CabinDetails"));
export const MyBookings = lazy(() => import("../domains/bookings/pages/MyBookings"));
export const PaymentSuccess = lazy(() => import("../domains/payments/pages/PaymentSuccess"));
export const PaymentFailure = lazy(() => import("../domains/payments/pages/PaymentFailure"));
export const InfoPage = lazy(() => import("../domains/guests/pages/InfoPage"));
