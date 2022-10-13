import { LatLng } from 'leaflet';
import { arraysEqual, round } from '../general.utils';
import {
  validateEmail,
  validateName,
  validatePassword,
} from '../validation.utils';

describe('Uutils', () => {
  describe('General utils', () => {
    test('should arraysEqual be true with primitive arrays', () => {
      let result: boolean = arraysEqual([0, 1], [0, 1]);
      expect(result).toBe(true);

      result = arraysEqual(['0', '1'], ['0', '1']);
      expect(result).toBe(true);

      result = arraysEqual([true, false], [true, false]);
      expect(result).toBe(true);
    });

    test('should arraysEqual be false with primitive arrays', () => {
      let result: boolean = arraysEqual([0, 1], [1, 2]);
      expect(result).toBe(false);

      result = arraysEqual(['0', '1'], ['1', '1']);
      expect(result).toBe(false);

      result = arraysEqual([true, false], [true, true]);
      expect(result).toBe(false);

      result = arraysEqual([0, 1], ['0', '1']);
      expect(result).toBe(false);
    });

    test('should arraysEqual be false with object arrays', () => {
      let result: boolean = arraysEqual(
        [new LatLng(11.11, 22.22)],
        [new LatLng(11.11, 22.22)]
      );
      expect(result).toBe(false);

      result = arraysEqual(
        [{ name: 'testName', age: 0 }],
        [{ name: 'testName', age: 0 }]
      );
      expect(result).toBe(false);
    });

    test('should arraysEqual be true with destructured object arrays', () => {
      const { lat, lng }: { lat: number; lng: number } = new LatLng(
        11.11,
        22.22
      );
      let result: boolean = arraysEqual([lat, lng], [lat, lng]);
      expect(result).toBe(true);

      const { name, age }: { name: string; age: number } = {
        name: 'testName',
        age: 0,
      };
      result = arraysEqual([name, age], [name, age]);
      expect(result).toBe(true);
    });

    test('should round function return correct number', () => {
      const testNumber: number = 12.345;

      expect(round(testNumber, 2)).toBe(12.35);
      expect(round(testNumber, 4)).toBe(12.345);
    });
  });

  describe('Validation utils', () => {
    test('should emails pass validation', () => {
      expect(validateEmail('test@email.com')).toBe(true);
    });

    test('should emails do not pass validation', () => {
      expect(validateEmail('@email.com')).toBe(false);

      expect(validateEmail('test&email.com')).toBe(false);

      expect(validateEmail('test@email.')).toBe(false);

      expect(validateEmail('test@.com')).toBe(false);
    });

    test('should name pass validation', () => {
      expect(validateName('Name')).toBe(true);
    });

    test('should name does not pass validation', () => {
      expect(validateName(' ')).toBe(false);
    });

    test('should password pass validation', () => {
      expect(validatePassword('Pass4321')).toBe(true);
      expect(validatePassword('Pas.4321')).toBe(true);
      expect(validatePassword('4321Pas_')).toBe(true);
      expect(validatePassword('Pa1     ')).toBe(true);
    });

    test('should passwords do not pass validation', () => {
      // no uppercase character
      expect(validatePassword('pass4321')).toBe(false);
      // no lowercase character
      expect(validatePassword('PASS4321')).toBe(false);
      // no character
      expect(validatePassword('43211234')).toBe(false);
      // no number
      expect(validatePassword('Password')).toBe(false);
      // too short
      expect(validatePassword('Pass432')).toBe(false);
    });
  });
});
