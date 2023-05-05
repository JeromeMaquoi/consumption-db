import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../release.test-samples';

import { ReleaseFormService } from './release-form.service';

describe('Release Form Service', () => {
  let service: ReleaseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReleaseFormService);
  });

  describe('Service methods', () => {
    describe('createReleaseFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createReleaseFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            methods: expect.any(Object),
          })
        );
      });

      it('passing IRelease should create a new form with FormGroup', () => {
        const formGroup = service.createReleaseFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            methods: expect.any(Object),
          })
        );
      });
    });

    describe('getRelease', () => {
      it('should return NewRelease for default Release initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createReleaseFormGroup(sampleWithNewData);

        const release = service.getRelease(formGroup) as any;

        expect(release).toMatchObject(sampleWithNewData);
      });

      it('should return NewRelease for empty Release initial value', () => {
        const formGroup = service.createReleaseFormGroup();

        const release = service.getRelease(formGroup) as any;

        expect(release).toMatchObject({});
      });

      it('should return IRelease', () => {
        const formGroup = service.createReleaseFormGroup(sampleWithRequiredData);

        const release = service.getRelease(formGroup) as any;

        expect(release).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRelease should not enable id FormControl', () => {
        const formGroup = service.createReleaseFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRelease should disable id FormControl', () => {
        const formGroup = service.createReleaseFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
