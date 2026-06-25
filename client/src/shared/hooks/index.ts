// Auth Hooks
export { useUser } from "./auth/useAuthUser";
export { useLogin } from "./auth/useLogin";
export { useLogout } from "./auth/useLogout";
export { useGoogleLogin } from "./auth/useGoogleLogin";
export { useSignup } from "./auth/useSignup";

// Booking Hooks
export { useBookings } from "./booking/useBookings";
export { useCreateBooking } from "./booking/useCreateBooking";
export { useDeleteBooking } from "./booking/useDeleteBooking";
export { useUpdateBooking } from "./booking/useUpdateBooking";
export { useCancelBooking } from "./booking/useCancelBooking";

// Cabin Hooks
export { useCabins } from "./cabin/useCabins";
export { useCreateCabin } from "./cabin/useCreateCabin";
export { useDeleteCabin } from "./cabin/useDeleteCabin";
export { useUpdateCabin } from "./cabin/useUpdateCabin";

// Guest Hooks
export { useGuests } from "./guests/useGuests";
export { useDeleteGuest } from "./guests/useDeleteGuest";
export { useUpdateGuest } from "./guests/useUpdateGuest";

// Setting Hooks
export { useSettings } from "./setting/useSettings";
export { useUpdateSettings } from "./setting/useUpdateSettings";

// Utility Hooks
export * from './usePagination';
export { useOffers } from "./useOffers";
export { useDashboardStats } from "./useDashboardStats";
