import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MeasureFormService, MeasureFormGroup } from './measure-form.service';
import { IMeasure } from '../measure.model';
import { MeasureService } from '../service/measure.service';
import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';
import { ConsumptionService } from 'app/entities/consumptionDb/consumption/service/consumption.service';

@Component({
  selector: 'jhi-measure-update',
  templateUrl: './measure-update.component.html',
})
export class MeasureUpdateComponent implements OnInit {
  isSaving = false;
  measure: IMeasure | null = null;

  consumptionsSharedCollection: IConsumption[] = [];

  editForm: MeasureFormGroup = this.measureFormService.createMeasureFormGroup();

  constructor(
    protected measureService: MeasureService,
    protected measureFormService: MeasureFormService,
    protected consumptionService: ConsumptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareConsumption = (o1: IConsumption | null, o2: IConsumption | null): boolean => this.consumptionService.compareConsumption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ measure }) => {
      this.measure = measure;
      if (measure) {
        this.updateForm(measure);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const measure = this.measureFormService.getMeasure(this.editForm);
    if (measure.id !== null) {
      this.subscribeToSaveResponse(this.measureService.update(measure));
    } else {
      this.subscribeToSaveResponse(this.measureService.create(measure));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMeasure>>): void {
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

  protected updateForm(measure: IMeasure): void {
    this.measure = measure;
    this.measureFormService.resetForm(this.editForm, measure);

    this.consumptionsSharedCollection = this.consumptionService.addConsumptionToCollectionIfMissing<IConsumption>(
      this.consumptionsSharedCollection,
      measure.consumption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consumptionService
      .query()
      .pipe(map((res: HttpResponse<IConsumption[]>) => res.body ?? []))
      .pipe(
        map((consumptions: IConsumption[]) =>
          this.consumptionService.addConsumptionToCollectionIfMissing<IConsumption>(consumptions, this.measure?.consumption)
        )
      )
      .subscribe((consumptions: IConsumption[]) => (this.consumptionsSharedCollection = consumptions));
  }
}
