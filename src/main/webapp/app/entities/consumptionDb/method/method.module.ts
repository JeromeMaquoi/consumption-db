import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MethodComponent } from './list/method.component';
import { MethodDetailComponent } from './detail/method-detail.component';
import { MethodUpdateComponent } from './update/method-update.component';
import { MethodDeleteDialogComponent } from './delete/method-delete-dialog.component';
import { MethodRoutingModule } from './route/method-routing.module';

@NgModule({
  imports: [SharedModule, MethodRoutingModule],
  declarations: [MethodComponent, MethodDetailComponent, MethodUpdateComponent, MethodDeleteDialogComponent],
})
export class ConsumptionDbMethodModule {}
