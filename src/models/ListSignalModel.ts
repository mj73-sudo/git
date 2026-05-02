import type { StrategyModel } from './StrategyModel.ts';
import  {SymbolModel} from './SymbolModel.ts';

export class ListSignalModel {
  signalType ?: 'Long' | 'Short';
  signalTime ?: string;
  strategy?:StrategyModel;
  symbol?:SymbolModel;
  price?:number;
}
