import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ReleaseComponent } from '../list/release.component';
import { ReleaseDetailComponent } from '../detail/release-detail.component';
import { ReleaseUpdateComponent } from '../update/release-update.component';
import { ReleaseRoutingResolveService } from './release-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const releaseRoute: Routes = [
  {
    path: '',
    component: ReleaseComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReleaseDetailComponent,
    resolve: {
      release: ReleaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReleaseUpdateComponent,
    resolve: {
      release: ReleaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReleaseUpdateComponent,
    resolve: {
      release: ReleaseRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(releaseRoute)],
  exports: [RouterModule],
})
export class ReleaseRoutingModule {}
