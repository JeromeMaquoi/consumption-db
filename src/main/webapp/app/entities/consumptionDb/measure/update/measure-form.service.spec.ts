import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../measure.test-samples';

import { MeasureFormService } from './measure-form.service';

describe('Measure Form Service', () => {
  let service: MeasureFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureFormService);
  });

  describe('Service methods', () => {
    describe('createMeasureFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMeasureFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTimestamp: expect.any(Object),
            consumption: expect.any(Object),
          })
        );
      });

      it('passing IMeasure should create a new form with FormGroup', () => {
        const formGroup = service.createMeasureFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startTimestamp: expect.any(Object),
            consumption: expect.any(Object),
          })
        );
      });
    });

    describe('getMeasure', () => {
      it('should return NewMeasure for default Measure initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMeasureFormGroup(sampleWithNewData);

        const measure = service.getMeasure(formGroup) as any;

        expect(measure).toMatchObject(sampleWithNewData);
      });

      it('should return NewMeasure for empty Measure initial value', () => {
        const formGroup = service.createMeasureFormGroup();

        const measure = service.getMeasure(formGroup) as any;

        expect(measure).toMatchObject({});
      });

      it('should return IMeasure', () => {
        const formGroup = service.createMeasureFormGroup(sampleWithRequiredData);

        const measure = service.getMeasure(formGroup) as any;

        expect(measure).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMeasure should not enable id FormControl', () => {
        const formGroup = service.createMeasureFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMeasure should disable id FormControl', () => {
        const formGroup = service.createMeasureFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
