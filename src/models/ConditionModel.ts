import type { ParamModel } from '../models/ParamModel.ts';

export class ConditionModel {
  id?:number;
  sourceType?: string;
  sourceParams?: ParamModel[];
  targetType?: string;
  targetParams?: ParamModel[];
  operator?: string;
  resolution?: string;
}
