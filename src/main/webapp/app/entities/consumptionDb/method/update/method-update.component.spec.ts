import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MethodFormService } from './method-form.service';
import { MethodService } from '../service/method.service';
import { IMethod } from '../method.model';
import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';
import { ConsumptionService } from 'app/entities/consumptionDb/consumption/service/consumption.service';

import { MethodUpdateComponent } from './method-update.component';

describe('Method Management Update Component', () => {
  let comp: MethodUpdateComponent;
  let fixture: ComponentFixture<MethodUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let methodFormService: MethodFormService;
  let methodService: MethodService;
  let consumptionService: ConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MethodUpdateComponent],
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
      .overrideTemplate(MethodUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MethodUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    methodFormService = TestBed.inject(MethodFormService);
    methodService = TestBed.inject(MethodService);
    consumptionService = TestBed.inject(ConsumptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call method query and add missing value', () => {
      const method: IMethod = { id: 456 };
      const method: IMethod = { id: 91960 };
      method.method = method;

      const methodCollection: IMethod[] = [{ id: 74266 }];
      jest.spyOn(methodService, 'query').mockReturnValue(of(new HttpResponse({ body: methodCollection })));
      const expectedCollection: IMethod[] = [method, ...methodCollection];
      jest.spyOn(methodService, 'addMethodToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ method });
      comp.ngOnInit();

      expect(methodService.query).toHaveBeenCalled();
      expect(methodService.addMethodToCollectionIfMissing).toHaveBeenCalledWith(methodCollection, method);
      expect(comp.methodsCollection).toEqual(expectedCollection);
    });

    it('Should call Consumption query and add missing value', () => {
      const method: IMethod = { id: 456 };
      const consumption: IConsumption = { id: 18627 };
      method.consumption = consumption;

      const consumptionCollection: IConsumption[] = [{ id: 8587 }];
      jest.spyOn(consumptionService, 'query').mockReturnValue(of(new HttpResponse({ body: consumptionCollection })));
      const additionalConsumptions = [consumption];
      const expectedCollection: IConsumption[] = [...additionalConsumptions, ...consumptionCollection];
      jest.spyOn(consumptionService, 'addConsumptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ method });
      comp.ngOnInit();

      expect(consumptionService.query).toHaveBeenCalled();
      expect(consumptionService.addConsumptionToCollectionIfMissing).toHaveBeenCalledWith(
        consumptionCollection,
        ...additionalConsumptions.map(expect.objectContaining)
      );
      expect(comp.consumptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const method: IMethod = { id: 456 };
      const method: IMethod = { id: 76045 };
      method.method = method;
      const consumption: IConsumption = { id: 2313 };
      method.consumption = consumption;

      activatedRoute.data = of({ method });
      comp.ngOnInit();

      expect(comp.methodsCollection).toContain(method);
      expect(comp.consumptionsSharedCollection).toContain(consumption);
      expect(comp.method).toEqual(method);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMethod>>();
      const method = { id: 123 };
      jest.spyOn(methodFormService, 'getMethod').mockReturnValue(method);
      jest.spyOn(methodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ method });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: method }));
      saveSubject.complete();

      // THEN
      expect(methodFormService.getMethod).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(methodService.update).toHaveBeenCalledWith(expect.objectContaining(method));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMethod>>();
      const method = { id: 123 };
      jest.spyOn(methodFormService, 'getMethod').mockReturnValue({ id: null });
      jest.spyOn(methodService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ method: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: method }));
      saveSubject.complete();

      // THEN
      expect(methodFormService.getMethod).toHaveBeenCalled();
      expect(methodService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMethod>>();
      const method = { id: 123 };
      jest.spyOn(methodService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ method });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(methodService.update).toHaveBeenCalled();
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

    describe('compareConsumption', () => {
      it('Should forward to consumptionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(consumptionService, 'compareConsumption');
        comp.compareConsumption(entity, entity2);
        expect(consumptionService.compareConsumption).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
