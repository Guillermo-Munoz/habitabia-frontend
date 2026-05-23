import { Routes } from "@angular/router";
import { RoomList } from "./room-list/room-list";
import { AuthGuard } from "../shared/guards/auth.guard";
import { RoomDetail } from "./room-detail/room-detail";
import { RoomCreate } from "./components/room-create/room-create";
import { RoomEdit } from "./components/room-edit/room-edit";
import { RoomMap } from "./components/room-map/room-map";

export const ROOMS_ROUTES: Routes = [
    {
        path: '',
        component: RoomList ,
        canActivate: [AuthGuard]
    },
    {
        path: 'map',
        component: RoomMap,
        canActivate: [AuthGuard]
    },
    {
        path: 'create',
        component: RoomCreate,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: RoomEdit,
        canActivate: [AuthGuard]
    },
     {
        path: ':id',
        component: RoomDetail ,
        canActivate: [AuthGuard]
    }
];