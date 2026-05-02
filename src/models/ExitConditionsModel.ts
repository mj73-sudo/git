import type { ParamModel } from './ParamModel.ts';

export class ExitConditionsModel {
  id?:number;
  sourceType?: string;
  sourceParams?: ParamModel[];
  targetType?: string;
  targetParams?: ParamModel[];
  operator?: string;
  resolution?: string;
}
