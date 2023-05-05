import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISoftware, NewSoftware } from '../software.model';

export type PartialUpdateSoftware = Partial<ISoftware> & Pick<ISoftware, 'id'>;

export type EntityResponseType = HttpResponse<ISoftware>;
export type EntityArrayResponseType = HttpResponse<ISoftware[]>;

@Injectable({ providedIn: 'root' })
export class SoftwareService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/software', 'consumptiondb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(software: NewSoftware): Observable<EntityResponseType> {
    return this.http.post<ISoftware>(this.resourceUrl, software, { observe: 'response' });
  }

  update(software: ISoftware): Observable<EntityResponseType> {
    return this.http.put<ISoftware>(`${this.resourceUrl}/${this.getSoftwareIdentifier(software)}`, software, { observe: 'response' });
  }

  partialUpdate(software: PartialUpdateSoftware): Observable<EntityResponseType> {
    return this.http.patch<ISoftware>(`${this.resourceUrl}/${this.getSoftwareIdentifier(software)}`, software, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISoftware>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISoftware[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSoftwareIdentifier(software: Pick<ISoftware, 'id'>): number {
    return software.id;
  }

  compareSoftware(o1: Pick<ISoftware, 'id'> | null, o2: Pick<ISoftware, 'id'> | null): boolean {
    return o1 && o2 ? this.getSoftwareIdentifier(o1) === this.getSoftwareIdentifier(o2) : o1 === o2;
  }

  addSoftwareToCollectionIfMissing<Type extends Pick<ISoftware, 'id'>>(
    softwareCollection: Type[],
    ...softwareToCheck: (Type | null | undefined)[]
  ): Type[] {
    const software: Type[] = softwareToCheck.filter(isPresent);
    if (software.length > 0) {
      const softwareCollectionIdentifiers = softwareCollection.map(softwareItem => this.getSoftwareIdentifier(softwareItem)!);
      const softwareToAdd = software.filter(softwareItem => {
        const softwareIdentifier = this.getSoftwareIdentifier(softwareItem);
        if (softwareCollectionIdentifiers.includes(softwareIdentifier)) {
          return false;
        }
        softwareCollectionIdentifiers.push(softwareIdentifier);
        return true;
      });
      return [...softwareToAdd, ...softwareCollection];
    }
    return softwareCollection;
  }
}
