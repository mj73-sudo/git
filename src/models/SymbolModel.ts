export class SymbolModel {
  id ?: number;
  name ?: string;
  exchange ?: string;
  symbolType ?: string;
  bookmark ?:boolean = false;
  active?: boolean=false;
}
