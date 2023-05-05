import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMethod } from '../method.model';

@Component({
  selector: 'jhi-method-detail',
  templateUrl: './method-detail.component.html',
})
export class MethodDetailComponent implements OnInit {
  method: IMethod | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ method }) => {
      this.method = method;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
