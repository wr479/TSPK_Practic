import { timingSafeEqual } from 'node:crypto';

export class TimingSafeEqual {
  static compare(actual: string, expected: string): boolean {
    if (typeof actual !== 'string' || typeof expected !== 'string') {
      return false;
    }

    const actualBuffer = Buffer.from(actual);
    const expectedBuffer = Buffer.from(expected);

    if (actualBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(actualBuffer, expectedBuffer);
  }
}

