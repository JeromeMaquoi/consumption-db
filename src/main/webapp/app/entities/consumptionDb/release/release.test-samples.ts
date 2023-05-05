import dayjs from 'dayjs/esm';

import { IRelease, NewRelease } from './release.model';

export const sampleWithRequiredData: IRelease = {
  id: 56662,
};

export const sampleWithPartialData: IRelease = {
  id: 14482,
  name: 'Wooden payment conglomeration',
  date: dayjs('2023-05-04T19:24'),
};

export const sampleWithFullData: IRelease = {
  id: 44379,
  name: 'optimize International',
  date: dayjs('2023-05-05T08:52'),
  description: 'Bedfordshire',
};

export const sampleWithNewData: NewRelease = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
