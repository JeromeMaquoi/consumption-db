import { IMethod, NewMethod } from './method.model';

export const sampleWithRequiredData: IMethod = {
  id: 6985,
};

export const sampleWithPartialData: IMethod = {
  id: 73368,
};

export const sampleWithFullData: IMethod = {
  id: 35327,
  name: 'Card standardization Communications',
};

export const sampleWithNewData: NewMethod = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
