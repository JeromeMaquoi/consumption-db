import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../software.test-samples';

import { SoftwareFormService } from './software-form.service';

describe('Software Form Service', () => {
  let service: SoftwareFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoftwareFormService);
  });

  describe('Service methods', () => {
    describe('createSoftwareFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSoftwareFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            release: expect.any(Object),
          })
        );
      });

      it('passing ISoftware should create a new form with FormGroup', () => {
        const formGroup = service.createSoftwareFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            release: expect.any(Object),
          })
        );
      });
    });

    describe('getSoftware', () => {
      it('should return NewSoftware for default Software initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSoftwareFormGroup(sampleWithNewData);

        const software = service.getSoftware(formGroup) as any;

        expect(software).toMatchObject(sampleWithNewData);
      });

      it('should return NewSoftware for empty Software initial value', () => {
        const formGroup = service.createSoftwareFormGroup();

        const software = service.getSoftware(formGroup) as any;

        expect(software).toMatchObject({});
      });

      it('should return ISoftware', () => {
        const formGroup = service.createSoftwareFormGroup(sampleWithRequiredData);

        const software = service.getSoftware(formGroup) as any;

        expect(software).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISoftware should not enable id FormControl', () => {
        const formGroup = service.createSoftwareFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSoftware should disable id FormControl', () => {
        const formGroup = service.createSoftwareFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
