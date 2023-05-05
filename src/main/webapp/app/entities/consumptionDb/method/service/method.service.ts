import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMethod, NewMethod } from '../method.model';

export type PartialUpdateMethod = Partial<IMethod> & Pick<IMethod, 'id'>;

export type EntityResponseType = HttpResponse<IMethod>;
export type EntityArrayResponseType = HttpResponse<IMethod[]>;

@Injectable({ providedIn: 'root' })
export class MethodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/methods', 'consumptiondb');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(method: NewMethod): Observable<EntityResponseType> {
    return this.http.post<IMethod>(this.resourceUrl, method, { observe: 'response' });
  }

  update(method: IMethod): Observable<EntityResponseType> {
    return this.http.put<IMethod>(`${this.resourceUrl}/${this.getMethodIdentifier(method)}`, method, { observe: 'response' });
  }

  partialUpdate(method: PartialUpdateMethod): Observable<EntityResponseType> {
    return this.http.patch<IMethod>(`${this.resourceUrl}/${this.getMethodIdentifier(method)}`, method, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMethod>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMethod[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMethodIdentifier(method: Pick<IMethod, 'id'>): number {
    return method.id;
  }

  compareMethod(o1: Pick<IMethod, 'id'> | null, o2: Pick<IMethod, 'id'> | null): boolean {
    return o1 && o2 ? this.getMethodIdentifier(o1) === this.getMethodIdentifier(o2) : o1 === o2;
  }

  addMethodToCollectionIfMissing<Type extends Pick<IMethod, 'id'>>(
    methodCollection: Type[],
    ...methodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const methods: Type[] = methodsToCheck.filter(isPresent);
    if (methods.length > 0) {
      const methodCollectionIdentifiers = methodCollection.map(methodItem => this.getMethodIdentifier(methodItem)!);
      const methodsToAdd = methods.filter(methodItem => {
        const methodIdentifier = this.getMethodIdentifier(methodItem);
        if (methodCollectionIdentifiers.includes(methodIdentifier)) {
          return false;
        }
        methodCollectionIdentifiers.push(methodIdentifier);
        return true;
      });
      return [...methodsToAdd, ...methodCollection];
    }
    return methodCollection;
  }
}
