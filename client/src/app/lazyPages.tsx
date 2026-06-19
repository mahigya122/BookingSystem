import { lazy } from "react";

export const Home = lazy(() => import("../domains/admin/pages/Home"));
export const Booking = lazy(() => import("../domains/admin/pages/Booking"));
export const Cabins = lazy(() => import("../domains/admin/pages/Cabins"));
export const Guests = lazy(() => import("../domains/admin/pages/Guests"));
export const Profile = lazy(() => import("../domains/admin/pages/Profile"));
export const Settings = lazy(() => import("../domains/admin/pages/Settings"));
export const Book = lazy(() => import("../domains/admin/pages/Book"));
export const Login = lazy(() => import("../domains/admin/pages/Login"));
export const Payments = lazy(() => import("../domains/admin/pages/Payments"));
export const Locations = lazy(() => import("../domains/admin/pages/Locations"));
export const Offers = lazy(() => import("../domains/admin/pages/Offers"));
export const Activities = lazy(() => import("../domains/admin/pages/Activities"));
export const Reviews = lazy(() => import("../domains/admin/pages/Reviews"));

// Trigger background preload for the primary entry Dashboard page
import("../domains/admin/pages/Home").catch(() => {});
