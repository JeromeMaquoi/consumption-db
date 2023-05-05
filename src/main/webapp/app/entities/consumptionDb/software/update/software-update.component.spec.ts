import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SoftwareFormService } from './software-form.service';
import { SoftwareService } from '../service/software.service';
import { ISoftware } from '../software.model';
import { IRelease } from 'app/entities/consumptionDb/release/release.model';
import { ReleaseService } from 'app/entities/consumptionDb/release/service/release.service';

import { SoftwareUpdateComponent } from './software-update.component';

describe('Software Management Update Component', () => {
  let comp: SoftwareUpdateComponent;
  let fixture: ComponentFixture<SoftwareUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let softwareFormService: SoftwareFormService;
  let softwareService: SoftwareService;
  let releaseService: ReleaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SoftwareUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SoftwareUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SoftwareUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    softwareFormService = TestBed.inject(SoftwareFormService);
    softwareService = TestBed.inject(SoftwareService);
    releaseService = TestBed.inject(ReleaseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Release query and add missing value', () => {
      const software: ISoftware = { id: 456 };
      const release: IRelease = { id: 98622 };
      software.release = release;

      const releaseCollection: IRelease[] = [{ id: 87323 }];
      jest.spyOn(releaseService, 'query').mockReturnValue(of(new HttpResponse({ body: releaseCollection })));
      const additionalReleases = [release];
      const expectedCollection: IRelease[] = [...additionalReleases, ...releaseCollection];
      jest.spyOn(releaseService, 'addReleaseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ software });
      comp.ngOnInit();

      expect(releaseService.query).toHaveBeenCalled();
      expect(releaseService.addReleaseToCollectionIfMissing).toHaveBeenCalledWith(
        releaseCollection,
        ...additionalReleases.map(expect.objectContaining)
      );
      expect(comp.releasesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const software: ISoftware = { id: 456 };
      const release: IRelease = { id: 32150 };
      software.release = release;

      activatedRoute.data = of({ software });
      comp.ngOnInit();

      expect(comp.releasesSharedCollection).toContain(release);
      expect(comp.software).toEqual(software);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoftware>>();
      const software = { id: 123 };
      jest.spyOn(softwareFormService, 'getSoftware').mockReturnValue(software);
      jest.spyOn(softwareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ software });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: software }));
      saveSubject.complete();

      // THEN
      expect(softwareFormService.getSoftware).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(softwareService.update).toHaveBeenCalledWith(expect.objectContaining(software));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoftware>>();
      const software = { id: 123 };
      jest.spyOn(softwareFormService, 'getSoftware').mockReturnValue({ id: null });
      jest.spyOn(softwareService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ software: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: software }));
      saveSubject.complete();

      // THEN
      expect(softwareFormService.getSoftware).toHaveBeenCalled();
      expect(softwareService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISoftware>>();
      const software = { id: 123 };
      jest.spyOn(softwareService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ software });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(softwareService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRelease', () => {
      it('Should forward to releaseService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(releaseService, 'compareRelease');
        comp.compareRelease(entity, entity2);
        expect(releaseService.compareRelease).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
