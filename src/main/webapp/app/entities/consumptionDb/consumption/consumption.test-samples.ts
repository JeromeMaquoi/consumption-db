import dayjs from 'dayjs/esm';

import { Scope } from 'app/entities/enumerations/scope.model';
import { MonitoringType } from 'app/entities/enumerations/monitoring-type.model';

import { IConsumption, NewConsumption } from './consumption.model';

export const sampleWithRequiredData: IConsumption = {
  id: 98935,
};

export const sampleWithPartialData: IConsumption = {
  id: 47843,
  value: 50250,
  scope: Scope['APP'],
  timestamp: dayjs('2023-05-04T15:20'),
};

export const sampleWithFullData: IConsumption = {
  id: 12777,
  value: 40436,
  scope: Scope['ALL'],
  monitoringType: MonitoringType['TOTAL'],
  timestamp: dayjs('2023-05-05T01:50'),
};

export const sampleWithNewData: NewConsumption = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
