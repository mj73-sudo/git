export class NumberHelper {

  static round2 (value?: number): string {
    return Number(value ?? 0).toFixed(2);
  }

  static getResolutions (): string[] {
    return ['1', '5', '15'];
  }


}
