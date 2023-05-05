import dayjs from 'dayjs/esm';
import { IMethod } from 'app/entities/consumptionDb/method/method.model';

export interface IRelease {
  id: number;
  name?: string | null;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  methods?: Pick<IMethod, 'id'>[] | null;
}

export type NewRelease = Omit<IRelease, 'id'> & { id: null };
