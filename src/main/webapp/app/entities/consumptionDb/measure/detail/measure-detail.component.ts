import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMeasure } from '../measure.model';

@Component({
  selector: 'jhi-measure-detail',
  templateUrl: './measure-detail.component.html',
})
export class MeasureDetailComponent implements OnInit {
  measure: IMeasure | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ measure }) => {
      this.measure = measure;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
