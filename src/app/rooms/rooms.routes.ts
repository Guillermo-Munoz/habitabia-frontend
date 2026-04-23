import { Routes } from "@angular/router";
import { RoomList } from "./room-list/room-list";

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomList 
    }
];