import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MeasureDetailComponent } from './measure-detail.component';

describe('Measure Management Detail Component', () => {
  let comp: MeasureDetailComponent;
  let fixture: ComponentFixture<MeasureDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeasureDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ measure: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MeasureDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MeasureDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load measure on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.measure).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
