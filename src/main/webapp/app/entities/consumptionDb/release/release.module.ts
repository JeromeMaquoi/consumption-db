import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReleaseComponent } from './list/release.component';
import { ReleaseDetailComponent } from './detail/release-detail.component';
import { ReleaseUpdateComponent } from './update/release-update.component';
import { ReleaseDeleteDialogComponent } from './delete/release-delete-dialog.component';
import { ReleaseRoutingModule } from './route/release-routing.module';

@NgModule({
  imports: [SharedModule, ReleaseRoutingModule],
  declarations: [ReleaseComponent, ReleaseDetailComponent, ReleaseUpdateComponent, ReleaseDeleteDialogComponent],
})
export class ConsumptionDbReleaseModule {}
