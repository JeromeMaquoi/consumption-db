import { IRelease } from 'app/entities/consumptionDb/release/release.model';

export interface ISoftware {
  id: number;
  name?: string | null;
  release?: Pick<IRelease, 'id'> | null;
}

export type NewSoftware = Omit<ISoftware, 'id'> & { id: null };
