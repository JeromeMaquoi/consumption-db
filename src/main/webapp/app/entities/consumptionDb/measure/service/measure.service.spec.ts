import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMeasure } from '../measure.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../measure.test-samples';

import { MeasureService, RestMeasure } from './measure.service';

const requireRestSample: RestMeasure = {
  ...sampleWithRequiredData,
  startTimestamp: sampleWithRequiredData.startTimestamp?.toJSON(),
};

describe('Measure Service', () => {
  let service: MeasureService;
  let httpMock: HttpTestingController;
  let expectedResult: IMeasure | IMeasure[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MeasureService);
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

    it('should create a Measure', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const measure = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(measure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Measure', () => {
      const measure = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(measure).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Measure', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Measure', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Measure', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMeasureToCollectionIfMissing', () => {
      it('should add a Measure to an empty array', () => {
        const measure: IMeasure = sampleWithRequiredData;
        expectedResult = service.addMeasureToCollectionIfMissing([], measure);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(measure);
      });

      it('should not add a Measure to an array that contains it', () => {
        const measure: IMeasure = sampleWithRequiredData;
        const measureCollection: IMeasure[] = [
          {
            ...measure,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMeasureToCollectionIfMissing(measureCollection, measure);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Measure to an array that doesn't contain it", () => {
        const measure: IMeasure = sampleWithRequiredData;
        const measureCollection: IMeasure[] = [sampleWithPartialData];
        expectedResult = service.addMeasureToCollectionIfMissing(measureCollection, measure);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(measure);
      });

      it('should add only unique Measure to an array', () => {
        const measureArray: IMeasure[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const measureCollection: IMeasure[] = [sampleWithRequiredData];
        expectedResult = service.addMeasureToCollectionIfMissing(measureCollection, ...measureArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const measure: IMeasure = sampleWithRequiredData;
        const measure2: IMeasure = sampleWithPartialData;
        expectedResult = service.addMeasureToCollectionIfMissing([], measure, measure2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(measure);
        expect(expectedResult).toContain(measure2);
      });

      it('should accept null and undefined values', () => {
        const measure: IMeasure = sampleWithRequiredData;
        expectedResult = service.addMeasureToCollectionIfMissing([], null, measure, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(measure);
      });

      it('should return initial array if no Measure is added', () => {
        const measureCollection: IMeasure[] = [sampleWithRequiredData];
        expectedResult = service.addMeasureToCollectionIfMissing(measureCollection, undefined, null);
        expect(expectedResult).toEqual(measureCollection);
      });
    });

    describe('compareMeasure', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMeasure(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMeasure(entity1, entity2);
        const compareResult2 = service.compareMeasure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMeasure(entity1, entity2);
        const compareResult2 = service.compareMeasure(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMeasure(entity1, entity2);
        const compareResult2 = service.compareMeasure(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
