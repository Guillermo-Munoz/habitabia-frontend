import { Routes } from "@angular/router";
import { RoomList } from "./room-list/room-list";
import { AuthGuard } from "../shared/guards/auth.guard";

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomList ,
        canActivate: [AuthGuard]
    }
];