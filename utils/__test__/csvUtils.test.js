const { it, expect } = require('@jest/globals');
const { addPaddingToUnit, addPostalCodeUnit } = require('../csvUtils');

describe('csvUtilsTest', () => {
  describe('addPaddingToUnit', () => {
    it('should addPadding to Unit with floor padding -3, no padding - 5', () => {
      const input = [{ unit: '01-10' }, { unit: '01-02' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001-00010' }, { unit: '001-00002' }]);
    });

    it('should only return padded number if no dash is present', () => {
      const input = [{ unit: '1' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001' }]);
    });

    it('should return padded number with dash if dash is present at the end', () => {
      const input = [{ unit: '1-' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001-' }]);
    });

    it('should return padded number with dash if dash is present at the end (more than 3 characters)', () => {
      const input = [{ unit: '0001-' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '0001-' }]);
    });

    it('should return 000 floor with padded unit num if dash is present at the start', () => {
      const input = [{ unit: '-123' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '000-00123' }]);
    });

    it('should return padded number properly if multiple dashes', () => {
      const input = [{ unit: '1-1-23' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001-01-23' }]);
    });

    it('should not pad unit number if more than or equal 5 digits', () => {
      const input = [{ unit: '1-12345' }, { unit: '1-1234567' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001-12345' }, { unit: '001-1234567' }]);
    });
  });

  describe('addPostalCodeUnit', () => {
    it('should addPostalCodeUnit to rows with unit and postal code', () => {
      const input = [
        { unit: '01-10', postalCode: '123456' },
        { unit: '01-02', postalCode: '456123' },
      ];
      const output = addPostalCodeUnit(input);
      expect(output).toEqual([
        {
          unit: input[0].unit,
          postalCode: input[0].postalCode,
          postalCodeUnit: `${input[0].postalCode}-${input[0].unit}`,
        },
        {
          unit: input[1].unit,
          postalCode: input[1].postalCode,
          postalCodeUnit: `${input[1].postalCode}-${input[1].unit}`,
        },
      ]);
    });
  });
});
