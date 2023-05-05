import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MeasureComponent } from '../list/measure.component';
import { MeasureDetailComponent } from '../detail/measure-detail.component';
import { MeasureUpdateComponent } from '../update/measure-update.component';
import { MeasureRoutingResolveService } from './measure-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const measureRoute: Routes = [
  {
    path: '',
    component: MeasureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MeasureDetailComponent,
    resolve: {
      measure: MeasureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MeasureUpdateComponent,
    resolve: {
      measure: MeasureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MeasureUpdateComponent,
    resolve: {
      measure: MeasureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(measureRoute)],
  exports: [RouterModule],
})
export class MeasureRoutingModule {}
