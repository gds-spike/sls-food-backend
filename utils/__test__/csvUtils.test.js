const { it, expect } = require('@jest/globals');
const { addPaddingToUnit } = require('../csvUtils');

describe('csvUtilsTest', () => {
  it('should pass simple test', () => {
    expect(1).toEqual(1);
  });

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

    it('should not pad unit number if more than or equal 5 digits', () => {
      const input = [{ unit: '1-12345' }, { unit: '1-1234567' }];
      const output = addPaddingToUnit(input);
      expect(output).toEqual([{ unit: '001-12345' }, { unit: '001-1234567' }]);
    });
  });
});
