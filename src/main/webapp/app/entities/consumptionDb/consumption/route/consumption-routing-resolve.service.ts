import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConsumption } from '../consumption.model';
import { ConsumptionService } from '../service/consumption.service';

@Injectable({ providedIn: 'root' })
export class ConsumptionRoutingResolveService implements Resolve<IConsumption | null> {
  constructor(protected service: ConsumptionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConsumption | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((consumption: HttpResponse<IConsumption>) => {
          if (consumption.body) {
            return of(consumption.body);
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
