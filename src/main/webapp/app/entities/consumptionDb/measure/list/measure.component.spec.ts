import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MeasureService } from '../service/measure.service';

import { MeasureComponent } from './measure.component';

describe('Measure Management Component', () => {
  let comp: MeasureComponent;
  let fixture: ComponentFixture<MeasureComponent>;
  let service: MeasureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'consumptiondb/measure', component: MeasureComponent }]), HttpClientTestingModule],
      declarations: [MeasureComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MeasureComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MeasureComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MeasureService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.measures?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to measureService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMeasureIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMeasureIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
