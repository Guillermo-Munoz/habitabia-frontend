import { Routes } from "@angular/router";
import { AuthGuard } from "../shared/guards/auth.guard";
import { GuestBookings } from "./components/guest-bookings/guest-bookings";

export const RESERVATION_ROUTES: Routes = [
    {
        path: '',
        component: GuestBookings ,
        canActivate: [AuthGuard]
    },
   
];