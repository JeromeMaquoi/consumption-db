import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReleaseFormService } from './release-form.service';
import { ReleaseService } from '../service/release.service';
import { IRelease } from '../release.model';
import { IMethod } from 'app/entities/consumptionDb/method/method.model';
import { MethodService } from 'app/entities/consumptionDb/method/service/method.service';

import { ReleaseUpdateComponent } from './release-update.component';

describe('Release Management Update Component', () => {
  let comp: ReleaseUpdateComponent;
  let fixture: ComponentFixture<ReleaseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let releaseFormService: ReleaseFormService;
  let releaseService: ReleaseService;
  let methodService: MethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReleaseUpdateComponent],
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
      .overrideTemplate(ReleaseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReleaseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    releaseFormService = TestBed.inject(ReleaseFormService);
    releaseService = TestBed.inject(ReleaseService);
    methodService = TestBed.inject(MethodService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Method query and add missing value', () => {
      const release: IRelease = { id: 456 };
      const methods: IMethod[] = [{ id: 29241 }];
      release.methods = methods;

      const methodCollection: IMethod[] = [{ id: 24162 }];
      jest.spyOn(methodService, 'query').mockReturnValue(of(new HttpResponse({ body: methodCollection })));
      const additionalMethods = [...methods];
      const expectedCollection: IMethod[] = [...additionalMethods, ...methodCollection];
      jest.spyOn(methodService, 'addMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ release });
      comp.ngOnInit();

      expect(methodService.query).toHaveBeenCalled();
      expect(methodService.addMethodToCollectionIfMissing).toHaveBeenCalledWith(
        methodCollection,
        ...additionalMethods.map(expect.objectContaining)
      );
      expect(comp.methodsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const release: IRelease = { id: 456 };
      const method: IMethod = { id: 77244 };
      release.methods = [method];

      activatedRoute.data = of({ release });
      comp.ngOnInit();

      expect(comp.methodsSharedCollection).toContain(method);
      expect(comp.release).toEqual(release);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelease>>();
      const release = { id: 123 };
      jest.spyOn(releaseFormService, 'getRelease').mockReturnValue(release);
      jest.spyOn(releaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ release });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: release }));
      saveSubject.complete();

      // THEN
      expect(releaseFormService.getRelease).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(releaseService.update).toHaveBeenCalledWith(expect.objectContaining(release));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelease>>();
      const release = { id: 123 };
      jest.spyOn(releaseFormService, 'getRelease').mockReturnValue({ id: null });
      jest.spyOn(releaseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ release: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: release }));
      saveSubject.complete();

      // THEN
      expect(releaseFormService.getRelease).toHaveBeenCalled();
      expect(releaseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRelease>>();
      const release = { id: 123 };
      jest.spyOn(releaseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ release });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(releaseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareMethod', () => {
      it('Should forward to methodService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(methodService, 'compareMethod');
        comp.compareMethod(entity, entity2);
        expect(methodService.compareMethod).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
