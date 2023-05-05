import { IConsumption } from 'app/entities/consumptionDb/consumption/consumption.model';
import { IRelease } from 'app/entities/consumptionDb/release/release.model';

export interface IMethod {
  id: number;
  name?: string | null;
  method?: Pick<IMethod, 'id'> | null;
  consumption?: Pick<IConsumption, 'id'> | null;
  releases?: Pick<IRelease, 'id'>[] | null;
}

export type NewMethod = Omit<IMethod, 'id'> & { id: null };
