import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConsumption } from '../consumption.model';

@Component({
  selector: 'jhi-consumption-detail',
  templateUrl: './consumption-detail.component.html',
})
export class ConsumptionDetailComponent implements OnInit {
  consumption: IConsumption | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consumption }) => {
      this.consumption = consumption;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
