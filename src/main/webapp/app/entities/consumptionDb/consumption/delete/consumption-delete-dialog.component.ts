import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConsumption } from '../consumption.model';
import { ConsumptionService } from '../service/consumption.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './consumption-delete-dialog.component.html',
})
export class ConsumptionDeleteDialogComponent {
  consumption?: IConsumption;

  constructor(protected consumptionService: ConsumptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.consumptionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
