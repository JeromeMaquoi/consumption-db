import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRelease, NewRelease } from '../release.model';

export type PartialUpdateRelease = Partial<IRelease> & Pick<IRelease, 'id'>;

type RestOf<T extends IRelease | NewRelease> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestRelease = RestOf<IRelease>;

export type NewRestRelease = RestOf<NewRelease>;

export type PartialUpdateRestRelease = RestOf<PartialUpdateRelease>;

export type EntityResponseType = HttpResponse<IRelease>;
export type EntityArrayResponseType = HttpResponse<IRelease[]>;

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/releases', 'consumptiondb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(release: NewRelease): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(release);
    return this.http
      .post<RestRelease>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(release: IRelease): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(release);
    return this.http
      .put<RestRelease>(`${this.resourceUrl}/${this.getReleaseIdentifier(release)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(release: PartialUpdateRelease): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(release);
    return this.http
      .patch<RestRelease>(`${this.resourceUrl}/${this.getReleaseIdentifier(release)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRelease>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRelease[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getReleaseIdentifier(release: Pick<IRelease, 'id'>): number {
    return release.id;
  }

  compareRelease(o1: Pick<IRelease, 'id'> | null, o2: Pick<IRelease, 'id'> | null): boolean {
    return o1 && o2 ? this.getReleaseIdentifier(o1) === this.getReleaseIdentifier(o2) : o1 === o2;
  }

  addReleaseToCollectionIfMissing<Type extends Pick<IRelease, 'id'>>(
    releaseCollection: Type[],
    ...releasesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const releases: Type[] = releasesToCheck.filter(isPresent);
    if (releases.length > 0) {
      const releaseCollectionIdentifiers = releaseCollection.map(releaseItem => this.getReleaseIdentifier(releaseItem)!);
      const releasesToAdd = releases.filter(releaseItem => {
        const releaseIdentifier = this.getReleaseIdentifier(releaseItem);
        if (releaseCollectionIdentifiers.includes(releaseIdentifier)) {
          return false;
        }
        releaseCollectionIdentifiers.push(releaseIdentifier);
        return true;
      });
      return [...releasesToAdd, ...releaseCollection];
    }
    return releaseCollection;
  }

  protected convertDateFromClient<T extends IRelease | NewRelease | PartialUpdateRelease>(release: T): RestOf<T> {
    return {
      ...release,
      date: release.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRelease: RestRelease): IRelease {
    return {
      ...restRelease,
      date: restRelease.date ? dayjs(restRelease.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRelease>): HttpResponse<IRelease> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRelease[]>): HttpResponse<IRelease[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
