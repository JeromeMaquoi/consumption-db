import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MethodService } from '../service/method.service';

import { MethodComponent } from './method.component';

describe('Method Management Component', () => {
  let comp: MethodComponent;
  let fixture: ComponentFixture<MethodComponent>;
  let service: MethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'consumptiondb/method', component: MethodComponent }]), HttpClientTestingModule],
      declarations: [MethodComponent],
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
      .overrideTemplate(MethodComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MethodComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MethodService);

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
    expect(comp.methods?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to methodService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMethodIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMethodIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
