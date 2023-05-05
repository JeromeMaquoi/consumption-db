import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISoftware } from '../software.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../software.test-samples';

import { SoftwareService } from './software.service';

const requireRestSample: ISoftware = {
  ...sampleWithRequiredData,
};

describe('Software Service', () => {
  let service: SoftwareService;
  let httpMock: HttpTestingController;
  let expectedResult: ISoftware | ISoftware[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SoftwareService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Software', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const software = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(software).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Software', () => {
      const software = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(software).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Software', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Software', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Software', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSoftwareToCollectionIfMissing', () => {
      it('should add a Software to an empty array', () => {
        const software: ISoftware = sampleWithRequiredData;
        expectedResult = service.addSoftwareToCollectionIfMissing([], software);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(software);
      });

      it('should not add a Software to an array that contains it', () => {
        const software: ISoftware = sampleWithRequiredData;
        const softwareCollection: ISoftware[] = [
          {
            ...software,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSoftwareToCollectionIfMissing(softwareCollection, software);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Software to an array that doesn't contain it", () => {
        const software: ISoftware = sampleWithRequiredData;
        const softwareCollection: ISoftware[] = [sampleWithPartialData];
        expectedResult = service.addSoftwareToCollectionIfMissing(softwareCollection, software);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(software);
      });

      it('should add only unique Software to an array', () => {
        const softwareArray: ISoftware[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const softwareCollection: ISoftware[] = [sampleWithRequiredData];
        expectedResult = service.addSoftwareToCollectionIfMissing(softwareCollection, ...softwareArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const software: ISoftware = sampleWithRequiredData;
        const software2: ISoftware = sampleWithPartialData;
        expectedResult = service.addSoftwareToCollectionIfMissing([], software, software2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(software);
        expect(expectedResult).toContain(software2);
      });

      it('should accept null and undefined values', () => {
        const software: ISoftware = sampleWithRequiredData;
        expectedResult = service.addSoftwareToCollectionIfMissing([], null, software, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(software);
      });

      it('should return initial array if no Software is added', () => {
        const softwareCollection: ISoftware[] = [sampleWithRequiredData];
        expectedResult = service.addSoftwareToCollectionIfMissing(softwareCollection, undefined, null);
        expect(expectedResult).toEqual(softwareCollection);
      });
    });

    describe('compareSoftware', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSoftware(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSoftware(entity1, entity2);
        const compareResult2 = service.compareSoftware(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSoftware(entity1, entity2);
        const compareResult2 = service.compareSoftware(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSoftware(entity1, entity2);
        const compareResult2 = service.compareSoftware(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
