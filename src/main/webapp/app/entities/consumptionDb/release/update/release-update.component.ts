import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReleaseFormService, ReleaseFormGroup } from './release-form.service';
import { IRelease } from '../release.model';
import { ReleaseService } from '../service/release.service';
import { IMethod } from 'app/entities/consumptionDb/method/method.model';
import { MethodService } from 'app/entities/consumptionDb/method/service/method.service';

@Component({
  selector: 'jhi-release-update',
  templateUrl: './release-update.component.html',
})
export class ReleaseUpdateComponent implements OnInit {
  isSaving = false;
  release: IRelease | null = null;

  methodsSharedCollection: IMethod[] = [];

  editForm: ReleaseFormGroup = this.releaseFormService.createReleaseFormGroup();

  constructor(
    protected releaseService: ReleaseService,
    protected releaseFormService: ReleaseFormService,
    protected methodService: MethodService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareMethod = (o1: IMethod | null, o2: IMethod | null): boolean => this.methodService.compareMethod(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ release }) => {
      this.release = release;
      if (release) {
        this.updateForm(release);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const release = this.releaseFormService.getRelease(this.editForm);
    if (release.id !== null) {
      this.subscribeToSaveResponse(this.releaseService.update(release));
    } else {
      this.subscribeToSaveResponse(this.releaseService.create(release));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRelease>>): void {
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

  protected updateForm(release: IRelease): void {
    this.release = release;
    this.releaseFormService.resetForm(this.editForm, release);

    this.methodsSharedCollection = this.methodService.addMethodToCollectionIfMissing<IMethod>(
      this.methodsSharedCollection,
      ...(release.methods ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.methodService
      .query()
      .pipe(map((res: HttpResponse<IMethod[]>) => res.body ?? []))
      .pipe(
        map((methods: IMethod[]) => this.methodService.addMethodToCollectionIfMissing<IMethod>(methods, ...(this.release?.methods ?? [])))
      )
      .subscribe((methods: IMethod[]) => (this.methodsSharedCollection = methods));
  }
}
