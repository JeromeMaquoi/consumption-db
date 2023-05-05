import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRelease } from '../release.model';
import { ReleaseService } from '../service/release.service';

@Injectable({ providedIn: 'root' })
export class ReleaseRoutingResolveService implements Resolve<IRelease | null> {
  constructor(protected service: ReleaseService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRelease | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((release: HttpResponse<IRelease>) => {
          if (release.body) {
            return of(release.body);
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
