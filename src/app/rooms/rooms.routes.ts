import { Routes } from "@angular/router";
import { RoomList } from "./room-list/room-list";
import { AuthGuard } from "../shared/guards/auth.guard";
import { RoomDetail } from "./room-detail/room-detail";

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomList ,
        canActivate: [AuthGuard]
    },
    {
        path: ':id',
        component: RoomDetail ,
        canActivate: [AuthGuard]
    }
];