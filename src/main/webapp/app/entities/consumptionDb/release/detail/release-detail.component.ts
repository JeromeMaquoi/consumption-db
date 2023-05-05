import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRelease } from '../release.model';

@Component({
  selector: 'jhi-release-detail',
  templateUrl: './release-detail.component.html',
})
export class ReleaseDetailComponent implements OnInit {
  release: IRelease | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ release }) => {
      this.release = release;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
