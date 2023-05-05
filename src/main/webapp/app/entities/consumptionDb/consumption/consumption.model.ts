import dayjs from 'dayjs/esm';
import { Scope } from 'app/entities/enumerations/scope.model';
import { MonitoringType } from 'app/entities/enumerations/monitoring-type.model';

export interface IConsumption {
  id: number;
  value?: number | null;
  scope?: Scope | null;
  monitoringType?: MonitoringType | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewConsumption = Omit<IConsumption, 'id'> & { id: null };
