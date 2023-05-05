import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../method.test-samples';

import { MethodFormService } from './method-form.service';

describe('Method Form Service', () => {
  let service: MethodFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MethodFormService);
  });

  describe('Service methods', () => {
    describe('createMethodFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMethodFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            method: expect.any(Object),
            consumption: expect.any(Object),
            releases: expect.any(Object),
          })
        );
      });

      it('passing IMethod should create a new form with FormGroup', () => {
        const formGroup = service.createMethodFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            method: expect.any(Object),
            consumption: expect.any(Object),
            releases: expect.any(Object),
          })
        );
      });
    });

    describe('getMethod', () => {
      it('should return NewMethod for default Method initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createMethodFormGroup(sampleWithNewData);

        const method = service.getMethod(formGroup) as any;

        expect(method).toMatchObject(sampleWithNewData);
      });

      it('should return NewMethod for empty Method initial value', () => {
        const formGroup = service.createMethodFormGroup();

        const method = service.getMethod(formGroup) as any;

        expect(method).toMatchObject({});
      });

      it('should return IMethod', () => {
        const formGroup = service.createMethodFormGroup(sampleWithRequiredData);

        const method = service.getMethod(formGroup) as any;

        expect(method).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMethod should not enable id FormControl', () => {
        const formGroup = service.createMethodFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMethod should disable id FormControl', () => {
        const formGroup = service.createMethodFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
