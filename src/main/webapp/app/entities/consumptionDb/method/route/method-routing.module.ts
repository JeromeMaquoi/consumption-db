import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MethodComponent } from '../list/method.component';
import { MethodDetailComponent } from '../detail/method-detail.component';
import { MethodUpdateComponent } from '../update/method-update.component';
import { MethodRoutingResolveService } from './method-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const methodRoute: Routes = [
  {
    path: '',
    component: MethodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MethodDetailComponent,
    resolve: {
      method: MethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MethodUpdateComponent,
    resolve: {
      method: MethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MethodUpdateComponent,
    resolve: {
      method: MethodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(methodRoute)],
  exports: [RouterModule],
})
export class MethodRoutingModule {}
