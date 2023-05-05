import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ReleaseDetailComponent } from './release-detail.component';

describe('Release Management Detail Component', () => {
  let comp: ReleaseDetailComponent;
  let fixture: ComponentFixture<ReleaseDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReleaseDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ release: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ReleaseDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ReleaseDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load release on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.release).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
