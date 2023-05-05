import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReleaseService } from '../service/release.service';

import { ReleaseComponent } from './release.component';

describe('Release Management Component', () => {
  let comp: ReleaseComponent;
  let fixture: ComponentFixture<ReleaseComponent>;
  let service: ReleaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'consumptiondb/release', component: ReleaseComponent }]), HttpClientTestingModule],
      declarations: [ReleaseComponent],
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
      .overrideTemplate(ReleaseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReleaseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReleaseService);

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
    expect(comp.releases?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to releaseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReleaseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReleaseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
