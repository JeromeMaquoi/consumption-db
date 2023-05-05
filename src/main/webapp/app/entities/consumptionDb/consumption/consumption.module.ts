import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ConsumptionComponent } from './list/consumption.component';
import { ConsumptionDetailComponent } from './detail/consumption-detail.component';
import { ConsumptionUpdateComponent } from './update/consumption-update.component';
import { ConsumptionDeleteDialogComponent } from './delete/consumption-delete-dialog.component';
import { ConsumptionRoutingModule } from './route/consumption-routing.module';

@NgModule({
  imports: [SharedModule, ConsumptionRoutingModule],
  declarations: [ConsumptionComponent, ConsumptionDetailComponent, ConsumptionUpdateComponent, ConsumptionDeleteDialogComponent],
})
export class ConsumptionDbConsumptionModule {}
