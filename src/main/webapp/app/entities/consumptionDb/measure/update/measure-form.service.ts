import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMeasure, NewMeasure } from '../measure.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMeasure for edit and NewMeasureFormGroupInput for create.
 */
type MeasureFormGroupInput = IMeasure | PartialWithRequiredKeyOf<NewMeasure>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMeasure | NewMeasure> = Omit<T, 'startTimestamp'> & {
  startTimestamp?: string | null;
};

type MeasureFormRawValue = FormValueOf<IMeasure>;

type NewMeasureFormRawValue = FormValueOf<NewMeasure>;

type MeasureFormDefaults = Pick<NewMeasure, 'id' | 'startTimestamp'>;

type MeasureFormGroupContent = {
  id: FormControl<MeasureFormRawValue['id'] | NewMeasure['id']>;
  startTimestamp: FormControl<MeasureFormRawValue['startTimestamp']>;
  consumption: FormControl<MeasureFormRawValue['consumption']>;
};

export type MeasureFormGroup = FormGroup<MeasureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MeasureFormService {
  createMeasureFormGroup(measure: MeasureFormGroupInput = { id: null }): MeasureFormGroup {
    const measureRawValue = this.convertMeasureToMeasureRawValue({
      ...this.getFormDefaults(),
      ...measure,
    });
    return new FormGroup<MeasureFormGroupContent>({
      id: new FormControl(
        { value: measureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTimestamp: new FormControl(measureRawValue.startTimestamp),
      consumption: new FormControl(measureRawValue.consumption),
    });
  }

  getMeasure(form: MeasureFormGroup): IMeasure | NewMeasure {
    return this.convertMeasureRawValueToMeasure(form.getRawValue() as MeasureFormRawValue | NewMeasureFormRawValue);
  }

  resetForm(form: MeasureFormGroup, measure: MeasureFormGroupInput): void {
    const measureRawValue = this.convertMeasureToMeasureRawValue({ ...this.getFormDefaults(), ...measure });
    form.reset(
      {
        ...measureRawValue,
        id: { value: measureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MeasureFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startTimestamp: currentTime,
    };
  }

  private convertMeasureRawValueToMeasure(rawMeasure: MeasureFormRawValue | NewMeasureFormRawValue): IMeasure | NewMeasure {
    return {
      ...rawMeasure,
      startTimestamp: dayjs(rawMeasure.startTimestamp, DATE_TIME_FORMAT),
    };
  }

  private convertMeasureToMeasureRawValue(
    measure: IMeasure | (Partial<NewMeasure> & MeasureFormDefaults)
  ): MeasureFormRawValue | PartialWithRequiredKeyOf<NewMeasureFormRawValue> {
    return {
      ...measure,
      startTimestamp: measure.startTimestamp ? measure.startTimestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
