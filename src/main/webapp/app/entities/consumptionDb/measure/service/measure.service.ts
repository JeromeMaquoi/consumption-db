import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMeasure, NewMeasure } from '../measure.model';

export type PartialUpdateMeasure = Partial<IMeasure> & Pick<IMeasure, 'id'>;

type RestOf<T extends IMeasure | NewMeasure> = Omit<T, 'startTimestamp'> & {
  startTimestamp?: string | null;
};

export type RestMeasure = RestOf<IMeasure>;

export type NewRestMeasure = RestOf<NewMeasure>;

export type PartialUpdateRestMeasure = RestOf<PartialUpdateMeasure>;

export type EntityResponseType = HttpResponse<IMeasure>;
export type EntityArrayResponseType = HttpResponse<IMeasure[]>;

@Injectable({ providedIn: 'root' })
export class MeasureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/measures', 'consumptiondb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(measure: NewMeasure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(measure);
    return this.http
      .post<RestMeasure>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(measure: IMeasure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(measure);
    return this.http
      .put<RestMeasure>(`${this.resourceUrl}/${this.getMeasureIdentifier(measure)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(measure: PartialUpdateMeasure): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(measure);
    return this.http
      .patch<RestMeasure>(`${this.resourceUrl}/${this.getMeasureIdentifier(measure)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMeasure>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMeasure[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMeasureIdentifier(measure: Pick<IMeasure, 'id'>): number {
    return measure.id;
  }

  compareMeasure(o1: Pick<IMeasure, 'id'> | null, o2: Pick<IMeasure, 'id'> | null): boolean {
    return o1 && o2 ? this.getMeasureIdentifier(o1) === this.getMeasureIdentifier(o2) : o1 === o2;
  }

  addMeasureToCollectionIfMissing<Type extends Pick<IMeasure, 'id'>>(
    measureCollection: Type[],
    ...measuresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const measures: Type[] = measuresToCheck.filter(isPresent);
    if (measures.length > 0) {
      const measureCollectionIdentifiers = measureCollection.map(measureItem => this.getMeasureIdentifier(measureItem)!);
      const measuresToAdd = measures.filter(measureItem => {
        const measureIdentifier = this.getMeasureIdentifier(measureItem);
        if (measureCollectionIdentifiers.includes(measureIdentifier)) {
          return false;
        }
        measureCollectionIdentifiers.push(measureIdentifier);
        return true;
      });
      return [...measuresToAdd, ...measureCollection];
    }
    return measureCollection;
  }

  protected convertDateFromClient<T extends IMeasure | NewMeasure | PartialUpdateMeasure>(measure: T): RestOf<T> {
    return {
      ...measure,
      startTimestamp: measure.startTimestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMeasure: RestMeasure): IMeasure {
    return {
      ...restMeasure,
      startTimestamp: restMeasure.startTimestamp ? dayjs(restMeasure.startTimestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMeasure>): HttpResponse<IMeasure> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMeasure[]>): HttpResponse<IMeasure[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
