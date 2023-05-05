import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SoftwareFormService, SoftwareFormGroup } from './software-form.service';
import { ISoftware } from '../software.model';
import { SoftwareService } from '../service/software.service';
import { IRelease } from 'app/entities/consumptionDb/release/release.model';
import { ReleaseService } from 'app/entities/consumptionDb/release/service/release.service';

@Component({
  selector: 'jhi-software-update',
  templateUrl: './software-update.component.html',
})
export class SoftwareUpdateComponent implements OnInit {
  isSaving = false;
  software: ISoftware | null = null;

  releasesSharedCollection: IRelease[] = [];

  editForm: SoftwareFormGroup = this.softwareFormService.createSoftwareFormGroup();

  constructor(
    protected softwareService: SoftwareService,
    protected softwareFormService: SoftwareFormService,
    protected releaseService: ReleaseService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareRelease = (o1: IRelease | null, o2: IRelease | null): boolean => this.releaseService.compareRelease(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ software }) => {
      this.software = software;
      if (software) {
        this.updateForm(software);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const software = this.softwareFormService.getSoftware(this.editForm);
    if (software.id !== null) {
      this.subscribeToSaveResponse(this.softwareService.update(software));
    } else {
      this.subscribeToSaveResponse(this.softwareService.create(software));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISoftware>>): void {
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

  protected updateForm(software: ISoftware): void {
    this.software = software;
    this.softwareFormService.resetForm(this.editForm, software);

    this.releasesSharedCollection = this.releaseService.addReleaseToCollectionIfMissing<IRelease>(
      this.releasesSharedCollection,
      software.release
    );
  }

  protected loadRelationshipsOptions(): void {
    this.releaseService
      .query()
      .pipe(map((res: HttpResponse<IRelease[]>) => res.body ?? []))
      .pipe(map((releases: IRelease[]) => this.releaseService.addReleaseToCollectionIfMissing<IRelease>(releases, this.software?.release)))
      .subscribe((releases: IRelease[]) => (this.releasesSharedCollection = releases));
  }
}
