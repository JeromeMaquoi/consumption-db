import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MeasureComponent } from './list/measure.component';
import { MeasureDetailComponent } from './detail/measure-detail.component';
import { MeasureUpdateComponent } from './update/measure-update.component';
import { MeasureDeleteDialogComponent } from './delete/measure-delete-dialog.component';
import { MeasureRoutingModule } from './route/measure-routing.module';

@NgModule({
  imports: [SharedModule, MeasureRoutingModule],
  declarations: [MeasureComponent, MeasureDetailComponent, MeasureUpdateComponent, MeasureDeleteDialogComponent],
})
export class ConsumptionDbMeasureModule {}
