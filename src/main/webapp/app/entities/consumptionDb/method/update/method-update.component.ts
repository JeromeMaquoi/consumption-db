import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { MethodFormService, MethodFormGroup } from './method-form.service';
import { IMethod } from '../method.model';
import { MethodService } from '../service/method.service';
import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';
import { ConsumptionService } from 'app/entities/consumptionDb/consumption/service/consumption.service';

@Component({
  selector: 'jhi-method-update',
  templateUrl: './method-update.component.html',
})
export class MethodUpdateComponent implements OnInit {
  isSaving = false;
  method: IMethod | null = null;

  methodsCollection: IMethod[] = [];
  consumptionsSharedCollection: IConsumption[] = [];

  editForm: MethodFormGroup = this.methodFormService.createMethodFormGroup();

  constructor(
    protected methodService: MethodService,
    protected methodFormService: MethodFormService,
    protected consumptionService: ConsumptionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMethod = (o1: IMethod | null, o2: IMethod | null): boolean => this.methodService.compareMethod(o1, o2);

  compareConsumption = (o1: IConsumption | null, o2: IConsumption | null): boolean => this.consumptionService.compareConsumption(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ method }) => {
      this.method = method;
      if (method) {
        this.updateForm(method);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const method = this.methodFormService.getMethod(this.editForm);
    if (method.id !== null) {
      this.subscribeToSaveResponse(this.methodService.update(method));
    } else {
      this.subscribeToSaveResponse(this.methodService.create(method));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMethod>>): void {
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

  protected updateForm(method: IMethod): void {
    this.method = method;
    this.methodFormService.resetForm(this.editForm, method);

    this.methodsCollection = this.methodService.addMethodToCollectionIfMissing<IMethod>(this.methodsCollection, method.method);
    this.consumptionsSharedCollection = this.consumptionService.addConsumptionToCollectionIfMissing<IConsumption>(
      this.consumptionsSharedCollection,
      method.consumption
    );
  }

  protected loadRelationshipsOptions(): void {
    this.methodService
      .query({ filter: 'method-is-null' })
      .pipe(map((res: HttpResponse<IMethod[]>) => res.body ?? []))
      .pipe(map((methods: IMethod[]) => this.methodService.addMethodToCollectionIfMissing<IMethod>(methods, this.method?.method)))
      .subscribe((methods: IMethod[]) => (this.methodsCollection = methods));

    this.consumptionService
      .query()
      .pipe(map((res: HttpResponse<IConsumption[]>) => res.body ?? []))
      .pipe(
        map((consumptions: IConsumption[]) =>
          this.consumptionService.addConsumptionToCollectionIfMissing<IConsumption>(consumptions, this.method?.consumption)
        )
      )
      .subscribe((consumptions: IConsumption[]) => (this.consumptionsSharedCollection = consumptions));
  }
}
