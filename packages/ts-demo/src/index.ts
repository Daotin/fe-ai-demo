/**
 * 简单的求和函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之和
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * 简单的相乘函数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两数之积
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

// 导出一个简单的类
export class Calculator {
  /**
   * 计算两数之差
   * @param a 第一个数字
   * @param b 第二个数字
   * @returns 两数之差
   */
  static subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * 计算两数之商
   * @param a 第一个数字
   * @param b 第二个数字
   * @returns 两数之商
   */
  static divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('不能除以零');
    }
    return a / b;
  }
}
