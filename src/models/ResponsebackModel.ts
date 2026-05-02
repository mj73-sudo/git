import { StrategyModel } from '../models/StrategyModel.ts';
import { UserModel } from '../models/auth/UserModel.ts';
import { SymbolModel } from '../models/SymbolModel.ts';

export class ResponsebackModel{
  id ?: number;
  strategy ?: StrategyModel;//نام استراتژی
  user ?: UserModel;
  symbol ?: SymbolModel;//نام نماد
  resolution ?: number;
  initialCapital ?: number;//بودجه اولیه
  finalCapital ?: number;//بودجه نهایی
  totalProfit ?: number;//سود خالص
  totalTrades ?:number;//کل معاملات
  winTrades ?: number;// تعداد برد
  winRate ?: number;//نرخ برد
  startTimestamp ?: number;
  endTimestamp ?: number;
  completed ?: boolean;
  status ?: string;//وضعیت
  statusTitle ?: string;//وضعیت
  errorMessage ?: number;
}
