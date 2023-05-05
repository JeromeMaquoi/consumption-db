import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConsumptionComponent } from '../list/consumption.component';
import { ConsumptionDetailComponent } from '../detail/consumption-detail.component';
import { ConsumptionUpdateComponent } from '../update/consumption-update.component';
import { ConsumptionRoutingResolveService } from './consumption-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const consumptionRoute: Routes = [
  {
    path: '',
    component: ConsumptionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConsumptionDetailComponent,
    resolve: {
      consumption: ConsumptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConsumptionUpdateComponent,
    resolve: {
      consumption: ConsumptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConsumptionUpdateComponent,
    resolve: {
      consumption: ConsumptionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(consumptionRoute)],
  exports: [RouterModule],
})
export class ConsumptionRoutingModule {}
