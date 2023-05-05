import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../consumption.test-samples';

import { ConsumptionFormService } from './consumption-form.service';

describe('Consumption Form Service', () => {
  let service: ConsumptionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumptionFormService);
  });

  describe('Service methods', () => {
    describe('createConsumptionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConsumptionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            scope: expect.any(Object),
            monitoringType: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });

      it('passing IConsumption should create a new form with FormGroup', () => {
        const formGroup = service.createConsumptionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            value: expect.any(Object),
            scope: expect.any(Object),
            monitoringType: expect.any(Object),
            timestamp: expect.any(Object),
          })
        );
      });
    });

    describe('getConsumption', () => {
      it('should return NewConsumption for default Consumption initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createConsumptionFormGroup(sampleWithNewData);

        const consumption = service.getConsumption(formGroup) as any;

        expect(consumption).toMatchObject(sampleWithNewData);
      });

      it('should return NewConsumption for empty Consumption initial value', () => {
        const formGroup = service.createConsumptionFormGroup();

        const consumption = service.getConsumption(formGroup) as any;

        expect(consumption).toMatchObject({});
      });

      it('should return IConsumption', () => {
        const formGroup = service.createConsumptionFormGroup(sampleWithRequiredData);

        const consumption = service.getConsumption(formGroup) as any;

        expect(consumption).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConsumption should not enable id FormControl', () => {
        const formGroup = service.createConsumptionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConsumption should disable id FormControl', () => {
        const formGroup = service.createConsumptionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
