import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MeasureFormService } from './measure-form.service';
import { MeasureService } from '../service/measure.service';
import { IMeasure } from '../measure.model';
import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';
import { ConsumptionService } from 'app/entities/consumptionDb/consumption/service/consumption.service';

import { MeasureUpdateComponent } from './measure-update.component';

describe('Measure Management Update Component', () => {
  let comp: MeasureUpdateComponent;
  let fixture: ComponentFixture<MeasureUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let measureFormService: MeasureFormService;
  let measureService: MeasureService;
  let consumptionService: ConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MeasureUpdateComponent],
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
      .overrideTemplate(MeasureUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MeasureUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    measureFormService = TestBed.inject(MeasureFormService);
    measureService = TestBed.inject(MeasureService);
    consumptionService = TestBed.inject(ConsumptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Consumption query and add missing value', () => {
      const measure: IMeasure = { id: 456 };
      const consumption: IConsumption = { id: 13578 };
      measure.consumption = consumption;

      const consumptionCollection: IConsumption[] = [{ id: 58333 }];
      jest.spyOn(consumptionService, 'query').mockReturnValue(of(new HttpResponse({ body: consumptionCollection })));
      const additionalConsumptions = [consumption];
      const expectedCollection: IConsumption[] = [...additionalConsumptions, ...consumptionCollection];
      jest.spyOn(consumptionService, 'addConsumptionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ measure });
      comp.ngOnInit();

      expect(consumptionService.query).toHaveBeenCalled();
      expect(consumptionService.addConsumptionToCollectionIfMissing).toHaveBeenCalledWith(
        consumptionCollection,
        ...additionalConsumptions.map(expect.objectContaining)
      );
      expect(comp.consumptionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const measure: IMeasure = { id: 456 };
      const consumption: IConsumption = { id: 88576 };
      measure.consumption = consumption;

      activatedRoute.data = of({ measure });
      comp.ngOnInit();

      expect(comp.consumptionsSharedCollection).toContain(consumption);
      expect(comp.measure).toEqual(measure);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeasure>>();
      const measure = { id: 123 };
      jest.spyOn(measureFormService, 'getMeasure').mockReturnValue(measure);
      jest.spyOn(measureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ measure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: measure }));
      saveSubject.complete();

      // THEN
      expect(measureFormService.getMeasure).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(measureService.update).toHaveBeenCalledWith(expect.objectContaining(measure));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeasure>>();
      const measure = { id: 123 };
      jest.spyOn(measureFormService, 'getMeasure').mockReturnValue({ id: null });
      jest.spyOn(measureService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ measure: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: measure }));
      saveSubject.complete();

      // THEN
      expect(measureFormService.getMeasure).toHaveBeenCalled();
      expect(measureService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMeasure>>();
      const measure = { id: 123 };
      jest.spyOn(measureService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ measure });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(measureService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
