import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConsumption, NewConsumption } from '../consumption.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConsumption for edit and NewConsumptionFormGroupInput for create.
 */
type ConsumptionFormGroupInput = IConsumption | PartialWithRequiredKeyOf<NewConsumption>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConsumption | NewConsumption> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ConsumptionFormRawValue = FormValueOf<IConsumption>;

type NewConsumptionFormRawValue = FormValueOf<NewConsumption>;

type ConsumptionFormDefaults = Pick<NewConsumption, 'id' | 'timestamp'>;

type ConsumptionFormGroupContent = {
  id: FormControl<ConsumptionFormRawValue['id'] | NewConsumption['id']>;
  value: FormControl<ConsumptionFormRawValue['value']>;
  scope: FormControl<ConsumptionFormRawValue['scope']>;
  monitoringType: FormControl<ConsumptionFormRawValue['monitoringType']>;
  timestamp: FormControl<ConsumptionFormRawValue['timestamp']>;
};

export type ConsumptionFormGroup = FormGroup<ConsumptionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConsumptionFormService {
  createConsumptionFormGroup(consumption: ConsumptionFormGroupInput = { id: null }): ConsumptionFormGroup {
    const consumptionRawValue = this.convertConsumptionToConsumptionRawValue({
      ...this.getFormDefaults(),
      ...consumption,
    });
    return new FormGroup<ConsumptionFormGroupContent>({
      id: new FormControl(
        { value: consumptionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      value: new FormControl(consumptionRawValue.value),
      scope: new FormControl(consumptionRawValue.scope),
      monitoringType: new FormControl(consumptionRawValue.monitoringType),
      timestamp: new FormControl(consumptionRawValue.timestamp),
    });
  }

  getConsumption(form: ConsumptionFormGroup): IConsumption | NewConsumption {
    return this.convertConsumptionRawValueToConsumption(form.getRawValue() as ConsumptionFormRawValue | NewConsumptionFormRawValue);
  }

  resetForm(form: ConsumptionFormGroup, consumption: ConsumptionFormGroupInput): void {
    const consumptionRawValue = this.convertConsumptionToConsumptionRawValue({ ...this.getFormDefaults(), ...consumption });
    form.reset(
      {
        ...consumptionRawValue,
        id: { value: consumptionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ConsumptionFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertConsumptionRawValueToConsumption(
    rawConsumption: ConsumptionFormRawValue | NewConsumptionFormRawValue
  ): IConsumption | NewConsumption {
    return {
      ...rawConsumption,
      timestamp: dayjs(rawConsumption.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertConsumptionToConsumptionRawValue(
    consumption: IConsumption | (Partial<NewConsumption> & ConsumptionFormDefaults)
  ): ConsumptionFormRawValue | PartialWithRequiredKeyOf<NewConsumptionFormRawValue> {
    return {
      ...consumption,
      timestamp: consumption.timestamp ? consumption.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
