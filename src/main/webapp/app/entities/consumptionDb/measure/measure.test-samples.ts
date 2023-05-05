import dayjs from 'dayjs/esm';

import { IMeasure, NewMeasure } from './measure.model';

export const sampleWithRequiredData: IMeasure = {
  id: 69547,
};

export const sampleWithPartialData: IMeasure = {
  id: 54555,
};

export const sampleWithFullData: IMeasure = {
  id: 63002,
  startTimestamp: dayjs('2023-05-05T01:01'),
};

export const sampleWithNewData: NewMeasure = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
