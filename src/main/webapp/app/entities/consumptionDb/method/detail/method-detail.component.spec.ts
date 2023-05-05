import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MethodDetailComponent } from './method-detail.component';

describe('Method Management Detail Component', () => {
  let comp: MethodDetailComponent;
  let fixture: ComponentFixture<MethodDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MethodDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ method: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MethodDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MethodDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load method on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.method).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
