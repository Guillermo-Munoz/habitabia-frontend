import { Routes } from "@angular/router";
import { AuthGuard } from "../shared/guards/auth.guard";
import { ProfileComponent } from "./components/profile.component/profile.component";


export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: ProfileComponent ,
        canActivate: [AuthGuard]
    },
    
];