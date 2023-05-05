import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConsumptionDetailComponent } from './consumption-detail.component';

describe('Consumption Management Detail Component', () => {
  let comp: ConsumptionDetailComponent;
  let fixture: ComponentFixture<ConsumptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ consumption: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConsumptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConsumptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load consumption on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.consumption).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
