import { ISoftware, NewSoftware } from './software.model';

export const sampleWithRequiredData: ISoftware = {
  id: 71299,
};

export const sampleWithPartialData: ISoftware = {
  id: 42517,
  name: 'Account Account Internal',
};

export const sampleWithFullData: ISoftware = {
  id: 86823,
  name: '1080p compressing calculating',
};

export const sampleWithNewData: NewSoftware = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
