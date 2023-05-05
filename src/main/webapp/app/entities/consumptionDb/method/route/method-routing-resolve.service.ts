import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMethod } from '../method.model';
import { MethodService } from '../service/method.service';

@Injectable({ providedIn: 'root' })
export class MethodRoutingResolveService implements Resolve<IMethod | null> {
  constructor(protected service: MethodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMethod | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((method: HttpResponse<IMethod>) => {
          if (method.body) {
            return of(method.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
