import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRelease, NewRelease } from '../release.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRelease for edit and NewReleaseFormGroupInput for create.
 */
type ReleaseFormGroupInput = IRelease | PartialWithRequiredKeyOf<NewRelease>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRelease | NewRelease> = Omit<T, 'date'> & {
  date?: string | null;
};

type ReleaseFormRawValue = FormValueOf<IRelease>;

type NewReleaseFormRawValue = FormValueOf<NewRelease>;

type ReleaseFormDefaults = Pick<NewRelease, 'id' | 'date' | 'methods'>;

type ReleaseFormGroupContent = {
  id: FormControl<ReleaseFormRawValue['id'] | NewRelease['id']>;
  name: FormControl<ReleaseFormRawValue['name']>;
  date: FormControl<ReleaseFormRawValue['date']>;
  description: FormControl<ReleaseFormRawValue['description']>;
  methods: FormControl<ReleaseFormRawValue['methods']>;
};

export type ReleaseFormGroup = FormGroup<ReleaseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReleaseFormService {
  createReleaseFormGroup(release: ReleaseFormGroupInput = { id: null }): ReleaseFormGroup {
    const releaseRawValue = this.convertReleaseToReleaseRawValue({
      ...this.getFormDefaults(),
      ...release,
    });
    return new FormGroup<ReleaseFormGroupContent>({
      id: new FormControl(
        { value: releaseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(releaseRawValue.name),
      date: new FormControl(releaseRawValue.date),
      description: new FormControl(releaseRawValue.description),
      methods: new FormControl(releaseRawValue.methods ?? []),
    });
  }

  getRelease(form: ReleaseFormGroup): IRelease | NewRelease {
    return this.convertReleaseRawValueToRelease(form.getRawValue() as ReleaseFormRawValue | NewReleaseFormRawValue);
  }

  resetForm(form: ReleaseFormGroup, release: ReleaseFormGroupInput): void {
    const releaseRawValue = this.convertReleaseToReleaseRawValue({ ...this.getFormDefaults(), ...release });
    form.reset(
      {
        ...releaseRawValue,
        id: { value: releaseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReleaseFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
      methods: [],
    };
  }

  private convertReleaseRawValueToRelease(rawRelease: ReleaseFormRawValue | NewReleaseFormRawValue): IRelease | NewRelease {
    return {
      ...rawRelease,
      date: dayjs(rawRelease.date, DATE_TIME_FORMAT),
    };
  }

  private convertReleaseToReleaseRawValue(
    release: IRelease | (Partial<NewRelease> & ReleaseFormDefaults)
  ): ReleaseFormRawValue | PartialWithRequiredKeyOf<NewReleaseFormRawValue> {
    return {
      ...release,
      date: release.date ? release.date.format(DATE_TIME_FORMAT) : undefined,
      methods: release.methods ?? [],
    };
  }
}
