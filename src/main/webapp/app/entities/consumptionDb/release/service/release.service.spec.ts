import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IRelease } from '../release.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../release.test-samples';

import { ReleaseService, RestRelease } from './release.service';

const requireRestSample: RestRelease = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.toJSON(),
};

describe('Release Service', () => {
  let service: ReleaseService;
  let httpMock: HttpTestingController;
  let expectedResult: IRelease | IRelease[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReleaseService);
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

    it('should create a Release', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const release = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(release).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Release', () => {
      const release = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(release).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Release', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Release', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Release', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReleaseToCollectionIfMissing', () => {
      it('should add a Release to an empty array', () => {
        const release: IRelease = sampleWithRequiredData;
        expectedResult = service.addReleaseToCollectionIfMissing([], release);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(release);
      });

      it('should not add a Release to an array that contains it', () => {
        const release: IRelease = sampleWithRequiredData;
        const releaseCollection: IRelease[] = [
          {
            ...release,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReleaseToCollectionIfMissing(releaseCollection, release);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Release to an array that doesn't contain it", () => {
        const release: IRelease = sampleWithRequiredData;
        const releaseCollection: IRelease[] = [sampleWithPartialData];
        expectedResult = service.addReleaseToCollectionIfMissing(releaseCollection, release);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(release);
      });

      it('should add only unique Release to an array', () => {
        const releaseArray: IRelease[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const releaseCollection: IRelease[] = [sampleWithRequiredData];
        expectedResult = service.addReleaseToCollectionIfMissing(releaseCollection, ...releaseArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const release: IRelease = sampleWithRequiredData;
        const release2: IRelease = sampleWithPartialData;
        expectedResult = service.addReleaseToCollectionIfMissing([], release, release2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(release);
        expect(expectedResult).toContain(release2);
      });

      it('should accept null and undefined values', () => {
        const release: IRelease = sampleWithRequiredData;
        expectedResult = service.addReleaseToCollectionIfMissing([], null, release, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(release);
      });

      it('should return initial array if no Release is added', () => {
        const releaseCollection: IRelease[] = [sampleWithRequiredData];
        expectedResult = service.addReleaseToCollectionIfMissing(releaseCollection, undefined, null);
        expect(expectedResult).toEqual(releaseCollection);
      });
    });

    describe('compareRelease', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRelease(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareRelease(entity1, entity2);
        const compareResult2 = service.compareRelease(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareRelease(entity1, entity2);
        const compareResult2 = service.compareRelease(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareRelease(entity1, entity2);
        const compareResult2 = service.compareRelease(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
