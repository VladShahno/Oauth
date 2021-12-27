import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from "./component/user-list/user-list.component";
import {CreateUserComponent} from "./component/create-user/create-user.component";
import {UpdateUserComponent} from "./component/update-user/update-user.component";
import {UserHomeComponent} from "./component/user-home/user-home.component";
import {AuthGuard} from "./component/page-guard/AuthGuard";
import {AdminGuard} from "./component/page-guard/admin-guard";

const routes: Routes = [
  {
    path: 'users/all',
    component: UserListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'users/new',
    component: CreateUserComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'users/update/:login',
    component: UpdateUserComponent,
    canActivate: [AuthGuard]
  },
  {path: 'home', component: UserHomeComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
