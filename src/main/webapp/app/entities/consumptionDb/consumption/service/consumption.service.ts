import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConsumption, NewConsumption } from '../consumption.model';

export type PartialUpdateConsumption = Partial<IConsumption> & Pick<IConsumption, 'id'>;

type RestOf<T extends IConsumption | NewConsumption> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestConsumption = RestOf<IConsumption>;

export type NewRestConsumption = RestOf<NewConsumption>;

export type PartialUpdateRestConsumption = RestOf<PartialUpdateConsumption>;

export type EntityResponseType = HttpResponse<IConsumption>;
export type EntityArrayResponseType = HttpResponse<IConsumption[]>;

@Injectable({ providedIn: 'root' })
export class ConsumptionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/consumptions', 'consumptiondb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(consumption: NewConsumption): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumption);
    return this.http
      .post<RestConsumption>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(consumption: IConsumption): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumption);
    return this.http
      .put<RestConsumption>(`${this.resourceUrl}/${this.getConsumptionIdentifier(consumption)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(consumption: PartialUpdateConsumption): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(consumption);
    return this.http
      .patch<RestConsumption>(`${this.resourceUrl}/${this.getConsumptionIdentifier(consumption)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConsumption>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConsumption[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConsumptionIdentifier(consumption: Pick<IConsumption, 'id'>): number {
    return consumption.id;
  }

  compareConsumption(o1: Pick<IConsumption, 'id'> | null, o2: Pick<IConsumption, 'id'> | null): boolean {
    return o1 && o2 ? this.getConsumptionIdentifier(o1) === this.getConsumptionIdentifier(o2) : o1 === o2;
  }

  addConsumptionToCollectionIfMissing<Type extends Pick<IConsumption, 'id'>>(
    consumptionCollection: Type[],
    ...consumptionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const consumptions: Type[] = consumptionsToCheck.filter(isPresent);
    if (consumptions.length > 0) {
      const consumptionCollectionIdentifiers = consumptionCollection.map(
        consumptionItem => this.getConsumptionIdentifier(consumptionItem)!
      );
      const consumptionsToAdd = consumptions.filter(consumptionItem => {
        const consumptionIdentifier = this.getConsumptionIdentifier(consumptionItem);
        if (consumptionCollectionIdentifiers.includes(consumptionIdentifier)) {
          return false;
        }
        consumptionCollectionIdentifiers.push(consumptionIdentifier);
        return true;
      });
      return [...consumptionsToAdd, ...consumptionCollection];
    }
    return consumptionCollection;
  }

  protected convertDateFromClient<T extends IConsumption | NewConsumption | PartialUpdateConsumption>(consumption: T): RestOf<T> {
    return {
      ...consumption,
      timestamp: consumption.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restConsumption: RestConsumption): IConsumption {
    return {
      ...restConsumption,
      timestamp: restConsumption.timestamp ? dayjs(restConsumption.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConsumption>): HttpResponse<IConsumption> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConsumption[]>): HttpResponse<IConsumption[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
