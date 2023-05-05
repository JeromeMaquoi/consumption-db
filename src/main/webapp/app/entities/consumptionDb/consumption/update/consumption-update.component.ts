import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ConsumptionFormService, ConsumptionFormGroup } from './consumption-form.service';
import { IConsumption } from '../consumption.model';
import { ConsumptionService } from '../service/consumption.service';
import { Scope } from 'app/entities/enumerations/scope.model';
import { MonitoringType } from 'app/entities/enumerations/monitoring-type.model';

@Component({
  selector: 'jhi-consumption-update',
  templateUrl: './consumption-update.component.html',
})
export class ConsumptionUpdateComponent implements OnInit {
  isSaving = false;
  consumption: IConsumption | null = null;
  scopeValues = Object.keys(Scope);
  monitoringTypeValues = Object.keys(MonitoringType);

  editForm: ConsumptionFormGroup = this.consumptionFormService.createConsumptionFormGroup();

  constructor(
    protected consumptionService: ConsumptionService,
    protected consumptionFormService: ConsumptionFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consumption }) => {
      this.consumption = consumption;
      if (consumption) {
        this.updateForm(consumption);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const consumption = this.consumptionFormService.getConsumption(this.editForm);
    if (consumption.id !== null) {
      this.subscribeToSaveResponse(this.consumptionService.update(consumption));
    } else {
      this.subscribeToSaveResponse(this.consumptionService.create(consumption));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsumption>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(consumption: IConsumption): void {
    this.consumption = consumption;
    this.consumptionFormService.resetForm(this.editForm, consumption);
  }
}
