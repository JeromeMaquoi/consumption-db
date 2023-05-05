import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConsumptionService } from '../service/consumption.service';

import { ConsumptionComponent } from './consumption.component';

describe('Consumption Management Component', () => {
  let comp: ConsumptionComponent;
  let fixture: ComponentFixture<ConsumptionComponent>;
  let service: ConsumptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'consumptiondb/consumption', component: ConsumptionComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ConsumptionComponent],
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
      .overrideTemplate(ConsumptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConsumptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ConsumptionService);

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
    expect(comp.consumptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to consumptionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getConsumptionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getConsumptionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
