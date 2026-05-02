import { SymbolModel } from './SymbolModel.ts';


export class ShowMarketModel {
  symbol ?: SymbolModel;
  resolution?: string;
  open?: string;
  high?: string;
  low?: string;
  close?: string;
  volume?: string;
  timestamp?: number;
}
