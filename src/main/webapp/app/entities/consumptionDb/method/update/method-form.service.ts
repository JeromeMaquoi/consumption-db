import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMethod, NewMethod } from '../method.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMethod for edit and NewMethodFormGroupInput for create.
 */
type MethodFormGroupInput = IMethod | PartialWithRequiredKeyOf<NewMethod>;

type MethodFormDefaults = Pick<NewMethod, 'id' | 'releases'>;

type MethodFormGroupContent = {
  id: FormControl<IMethod['id'] | NewMethod['id']>;
  name: FormControl<IMethod['name']>;
  method: FormControl<IMethod['method']>;
  consumption: FormControl<IMethod['consumption']>;
  releases: FormControl<IMethod['releases']>;
};

export type MethodFormGroup = FormGroup<MethodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MethodFormService {
  createMethodFormGroup(method: MethodFormGroupInput = { id: null }): MethodFormGroup {
    const methodRawValue = {
      ...this.getFormDefaults(),
      ...method,
    };
    return new FormGroup<MethodFormGroupContent>({
      id: new FormControl(
        { value: methodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(methodRawValue.name),
      method: new FormControl(methodRawValue.method),
      consumption: new FormControl(methodRawValue.consumption),
      releases: new FormControl(methodRawValue.releases ?? []),
    });
  }

  getMethod(form: MethodFormGroup): IMethod | NewMethod {
    return form.getRawValue() as IMethod | NewMethod;
  }

  resetForm(form: MethodFormGroup, method: MethodFormGroupInput): void {
    const methodRawValue = { ...this.getFormDefaults(), ...method };
    form.reset(
      {
        ...methodRawValue,
        id: { value: methodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MethodFormDefaults {
    return {
      id: null,
      releases: [],
    };
  }
}
