import dayjs from 'dayjs/esm';
import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';

export interface IMeasure {
  id: number;
  startTimestamp?: dayjs.Dayjs | null;
  consumption?: Pick<IConsumption, 'id'> | null;
}

export type NewMeasure = Omit<IMeasure, 'id'> & { id: null };
