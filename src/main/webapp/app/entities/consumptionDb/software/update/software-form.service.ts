import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISoftware, NewSoftware } from '../software.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISoftware for edit and NewSoftwareFormGroupInput for create.
 */
type SoftwareFormGroupInput = ISoftware | PartialWithRequiredKeyOf<NewSoftware>;

type SoftwareFormDefaults = Pick<NewSoftware, 'id'>;

type SoftwareFormGroupContent = {
  id: FormControl<ISoftware['id'] | NewSoftware['id']>;
  name: FormControl<ISoftware['name']>;
  release: FormControl<ISoftware['release']>;
};

export type SoftwareFormGroup = FormGroup<SoftwareFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SoftwareFormService {
  createSoftwareFormGroup(software: SoftwareFormGroupInput = { id: null }): SoftwareFormGroup {
    const softwareRawValue = {
      ...this.getFormDefaults(),
      ...software,
    };
    return new FormGroup<SoftwareFormGroupContent>({
      id: new FormControl(
        { value: softwareRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(softwareRawValue.name),
      release: new FormControl(softwareRawValue.release),
    });
  }

  getSoftware(form: SoftwareFormGroup): ISoftware | NewSoftware {
    return form.getRawValue() as ISoftware | NewSoftware;
  }

  resetForm(form: SoftwareFormGroup, software: SoftwareFormGroupInput): void {
    const softwareRawValue = { ...this.getFormDefaults(), ...software };
    form.reset(
      {
        ...softwareRawValue,
        id: { value: softwareRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SoftwareFormDefaults {
    return {
      id: null,
    };
  }
}
