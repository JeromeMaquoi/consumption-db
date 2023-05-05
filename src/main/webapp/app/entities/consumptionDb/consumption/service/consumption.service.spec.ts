import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConsumption } from '../consumption.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../consumption.test-samples';

import { ConsumptionService, RestConsumption } from './consumption.service';

const requireRestSample: RestConsumption = {
  ...sampleWithRequiredData,
  timestamp: sampleWithRequiredData.timestamp?.toJSON(),
};

describe('Consumption Service', () => {
  let service: ConsumptionService;
  let httpMock: HttpTestingController;
  let expectedResult: IConsumption | IConsumption[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConsumptionService);
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

    it('should create a Consumption', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const consumption = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(consumption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Consumption', () => {
      const consumption = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(consumption).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Consumption', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Consumption', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Consumption', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConsumptionToCollectionIfMissing', () => {
      it('should add a Consumption to an empty array', () => {
        const consumption: IConsumption = sampleWithRequiredData;
        expectedResult = service.addConsumptionToCollectionIfMissing([], consumption);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consumption);
      });

      it('should not add a Consumption to an array that contains it', () => {
        const consumption: IConsumption = sampleWithRequiredData;
        const consumptionCollection: IConsumption[] = [
          {
            ...consumption,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConsumptionToCollectionIfMissing(consumptionCollection, consumption);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Consumption to an array that doesn't contain it", () => {
        const consumption: IConsumption = sampleWithRequiredData;
        const consumptionCollection: IConsumption[] = [sampleWithPartialData];
        expectedResult = service.addConsumptionToCollectionIfMissing(consumptionCollection, consumption);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consumption);
      });

      it('should add only unique Consumption to an array', () => {
        const consumptionArray: IConsumption[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const consumptionCollection: IConsumption[] = [sampleWithRequiredData];
        expectedResult = service.addConsumptionToCollectionIfMissing(consumptionCollection, ...consumptionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const consumption: IConsumption = sampleWithRequiredData;
        const consumption2: IConsumption = sampleWithPartialData;
        expectedResult = service.addConsumptionToCollectionIfMissing([], consumption, consumption2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(consumption);
        expect(expectedResult).toContain(consumption2);
      });

      it('should accept null and undefined values', () => {
        const consumption: IConsumption = sampleWithRequiredData;
        expectedResult = service.addConsumptionToCollectionIfMissing([], null, consumption, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(consumption);
      });

      it('should return initial array if no Consumption is added', () => {
        const consumptionCollection: IConsumption[] = [sampleWithRequiredData];
        expectedResult = service.addConsumptionToCollectionIfMissing(consumptionCollection, undefined, null);
        expect(expectedResult).toEqual(consumptionCollection);
      });
    });

    describe('compareConsumption', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConsumption(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConsumption(entity1, entity2);
        const compareResult2 = service.compareConsumption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConsumption(entity1, entity2);
        const compareResult2 = service.compareConsumption(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConsumption(entity1, entity2);
        const compareResult2 = service.compareConsumption(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
