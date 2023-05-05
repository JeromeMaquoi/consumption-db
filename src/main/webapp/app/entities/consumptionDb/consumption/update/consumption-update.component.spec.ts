import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConsumptionFormService } from './consumption-form.service';
import { ConsumptionService } from '../service/consumption.service';
import { IConsumption } from '../consumption.model';

import { ConsumptionUpdateComponent } from './consumption-update.component';

describe('Consumption Management Update Component', () => {
  let comp: ConsumptionUpdateComponent;
  let fixture: ComponentFixture<ConsumptionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let consumptionFormService: ConsumptionFormService;
  let consumptionService: ConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConsumptionUpdateComponent],
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
      .overrideTemplate(ConsumptionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsumptionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    consumptionFormService = TestBed.inject(ConsumptionFormService);
    consumptionService = TestBed.inject(ConsumptionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const consumption: IConsumption = { id: 456 };

      activatedRoute.data = of({ consumption });
      comp.ngOnInit();

      expect(comp.consumption).toEqual(consumption);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsumption>>();
      const consumption = { id: 123 };
      jest.spyOn(consumptionFormService, 'getConsumption').mockReturnValue(consumption);
      jest.spyOn(consumptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consumption }));
      saveSubject.complete();

      // THEN
      expect(consumptionFormService.getConsumption).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(consumptionService.update).toHaveBeenCalledWith(expect.objectContaining(consumption));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsumption>>();
      const consumption = { id: 123 };
      jest.spyOn(consumptionFormService, 'getConsumption').mockReturnValue({ id: null });
      jest.spyOn(consumptionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumption: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: consumption }));
      saveSubject.complete();

      // THEN
      expect(consumptionFormService.getConsumption).toHaveBeenCalled();
      expect(consumptionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConsumption>>();
      const consumption = { id: 123 };
      jest.spyOn(consumptionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ consumption });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(consumptionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
