import { ConditionModel } from '../models/ConditionModel.ts';
import { ExitConditionsModel } from './ExitConditionsModel.ts';

export class StrategyModel {
  id?: number;
  name?: string;
  conditions?: ConditionModel[];
  exitConditions?:ExitConditionsModel[];
  signalType?: 'Long' | 'Short';
  symbolIds?:number[]=[];
  active?:boolean=false;
  tp?:number;
  sl?:number;
  createdDate?:number;
  totalBackTest?:number;
  winRate?:number;
  badge?:string;

}
