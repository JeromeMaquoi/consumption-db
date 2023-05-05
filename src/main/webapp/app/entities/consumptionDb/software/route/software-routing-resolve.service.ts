import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISoftware } from '../software.model';
import { SoftwareService } from '../service/software.service';

@Injectable({ providedIn: 'root' })
export class SoftwareRoutingResolveService implements Resolve<ISoftware | null> {
  constructor(protected service: SoftwareService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISoftware | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((software: HttpResponse<ISoftware>) => {
          if (software.body) {
            return of(software.body);
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
