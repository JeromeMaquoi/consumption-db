import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMethod } from '../method.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../method.test-samples';

import { MethodService } from './method.service';

const requireRestSample: IMethod = {
  ...sampleWithRequiredData,
};

describe('Method Service', () => {
  let service: MethodService;
  let httpMock: HttpTestingController;
  let expectedResult: IMethod | IMethod[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MethodService);
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

    it('should create a Method', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const method = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(method).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Method', () => {
      const method = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(method).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Method', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Method', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Method', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMethodToCollectionIfMissing', () => {
      it('should add a Method to an empty array', () => {
        const method: IMethod = sampleWithRequiredData;
        expectedResult = service.addMethodToCollectionIfMissing([], method);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(method);
      });

      it('should not add a Method to an array that contains it', () => {
        const method: IMethod = sampleWithRequiredData;
        const methodCollection: IMethod[] = [
          {
            ...method,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMethodToCollectionIfMissing(methodCollection, method);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Method to an array that doesn't contain it", () => {
        const method: IMethod = sampleWithRequiredData;
        const methodCollection: IMethod[] = [sampleWithPartialData];
        expectedResult = service.addMethodToCollectionIfMissing(methodCollection, method);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(method);
      });

      it('should add only unique Method to an array', () => {
        const methodArray: IMethod[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const methodCollection: IMethod[] = [sampleWithRequiredData];
        expectedResult = service.addMethodToCollectionIfMissing(methodCollection, ...methodArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const method: IMethod = sampleWithRequiredData;
        const method2: IMethod = sampleWithPartialData;
        expectedResult = service.addMethodToCollectionIfMissing([], method, method2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(method);
        expect(expectedResult).toContain(method2);
      });

      it('should accept null and undefined values', () => {
        const method: IMethod = sampleWithRequiredData;
        expectedResult = service.addMethodToCollectionIfMissing([], null, method, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(method);
      });

      it('should return initial array if no Method is added', () => {
        const methodCollection: IMethod[] = [sampleWithRequiredData];
        expectedResult = service.addMethodToCollectionIfMissing(methodCollection, undefined, null);
        expect(expectedResult).toEqual(methodCollection);
      });
    });

    describe('compareMethod', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMethod(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMethod(entity1, entity2);
        const compareResult2 = service.compareMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMethod(entity1, entity2);
        const compareResult2 = service.compareMethod(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMethod(entity1, entity2);
        const compareResult2 = service.compareMethod(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
