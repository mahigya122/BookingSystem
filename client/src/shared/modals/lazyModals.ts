import { lazy } from "react";

export const CheckoutModal = lazy(() => import("../../domains/cabins/details/CheckoutModal"));
export const CabinDetailModal = lazy(() => import("../../domains/admin/components/cabin/CabinDetailModal"));
export const CreateCabinModal = lazy(() => import("../../domains/admin/components/cabin/CreateCabinModal"));
export const EditCabinModal = lazy(() => import("../../domains/admin/components/cabin/EditCabinModal"));
export const EditBookingModal = lazy(() => import("../../domains/admin/components/booking/EditBookingModal"));
export const BookingDetailModal = lazy(() => import("../../domains/admin/components/booking/BookingDetailModal"));
export const EditGuestModal = lazy(() => import("../../domains/admin/components/guest/EditGuestModal"));
export const ProfileIncompleteModal = lazy(() => import("../../domains/cabins/details/ProfileIncompleteModal"));
export const InvoiceModal = lazy(() => import("./InvoiceModal"));
