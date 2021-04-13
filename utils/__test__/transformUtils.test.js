const { it, expect } = require('@jest/globals');
const { padUnit, getProfileRows, getProgrammeRows } = require('../transformUtils');

describe('transformUtils', () => {
  describe('padUnit', () => {
    it('should pad unit with floor padding -3, no padding - 5', () => {
      const input = '01-10';
      const output = padUnit(input);
      expect(output).toEqual('001-00010');
    });

    it('should only return padded number if no dash is present', () => {
      const input = '1';
      const output = padUnit(input);
      expect(output).toEqual('001');
    });

    it('should return padded number with dash if dash is present at the end', () => {
      const input = '1-';
      const output = padUnit(input);
      expect(output).toEqual('001-');
    });

    it('should return padded number with dash if dash is present at the end (more than 3 characters)', () => {
      const input = '0001-';
      const output = padUnit(input);
      expect(output).toEqual('0001-');
    });

    it('should return 000 floor with padded unit num if dash is present at the start', () => {
      const input = '-123';
      const output = padUnit(input);
      expect(output).toEqual('000-00123');
    });

    it('should return padded number properly if multiple dashes', () => {
      const input = '1-1-23';
      const output = padUnit(input);
      expect(output).toEqual('001-01-23');
    });

    it('should not pad unit number if more than or equal 5 digits', () => {
      const input = '1-12345';
      const output = padUnit(input);
      expect(output).toEqual('001-12345');
    });
  });

  describe('getProfileRows', () => {
    it('should only return rows with postal code and unit', () => {
      const input = [{ clientName: 'abc' }, { programmeName: 'def' }];
      const output = getProfileRows(input);
      expect(output).toHaveLength(0);
    });

    it('should return rows with postal code and unit, but source is optional', () => {
      const input = [
        { postalCodeUnit: 'abc' },
        { postalCodeUnit: 'def', dataSource: '111' },
        { dataSource: '222' },
      ];
      const output = getProfileRows(input);
      expect(output).toHaveLength(2);
    });

    it('should append PK and SK to rows with postal code and unit', () => {
      const input = [
        { postalCodeUnit: 'abc' },
        { postalCodeUnit: 'def', dataSource: '111' },
        { dataSource: '222' },
      ];
      const output = getProfileRows(input);
      expect(output).toHaveLength(2);
      expect(output[0]).toEqual({
        postalCodeUnit: input[0].postalCodeUnit,
        PK: `CLIENT#${input[0].postalCodeUnit}`,
        SK: `#SOURCE#`,
      });
      expect(output[1]).toEqual({
        postalCodeUnit: input[1].postalCodeUnit,
        dataSource: input[1].dataSource,
        PK: `CLIENT#${input[1].postalCodeUnit}`,
        SK: `#SOURCE#${input[1].dataSource}`,
      });
    });

    it('should drop additional columns that are not required for profile', () => {
      const input = [
        { postalCodeUnit: 'abc', no: '1' },
        { postalCodeUnit: 'def', dataSource: '111', no: '2' },
        { dataSource: '222' },
      ];
      const output = getProfileRows(input);
      expect(output).toHaveLength(2);
      expect(output[0]).toEqual({
        postalCodeUnit: input[0].postalCodeUnit,
        PK: `CLIENT#${input[0].postalCodeUnit}`,
        SK: `#SOURCE#`,
      });
      expect(output[1]).toEqual({
        postalCodeUnit: input[1].postalCodeUnit,
        dataSource: input[1].dataSource,
        PK: `CLIENT#${input[1].postalCodeUnit}`,
        SK: `#SOURCE#${input[1].dataSource}`,
      });
    });
  });

  describe('getProgrammeRows', () => {
    it('should only return rows with postalCodeUnit and programmeName', () => {
      const input = [
        { unit: '123', programmeName: 'abc' },
        { block: '1', postalCodeUnit: '123' },
      ];
      const output = getProgrammeRows(input);
      expect(output).toHaveLength(0);
    });

    it('should only return rows with postalCodeUnit and programmeName', () => {
      const input = [
        { programmeName: 'abc', postalCodeUnit: '123' },
        { block: '1', postalCodeUnit: '123' },
      ];
      const output = getProgrammeRows(input);
      expect(output).toHaveLength(1);
      expect(output[0]).toEqual({
        postalCodeUnit: input[0].postalCodeUnit,
        programmeName: input[0].programmeName,
        PK: `CLIENT#${input[0].postalCodeUnit}`,
        SK: `#PROGRAMME#${input[0].programmeName}`,
      });
    });

    it('should only not return unwanted columns', () => {
      const input = [
        { programmeName: 'abc', postalCodeUnit: '123', no: '1', unit: '123' },
        { block: '1', postalCodeUnit: '123' },
      ];
      const output = getProgrammeRows(input);
      expect(output).toHaveLength(1);
      expect(output[0]).toEqual({
        postalCodeUnit: input[0].postalCodeUnit,
        programmeName: input[0].programmeName,
        PK: `CLIENT#${input[0].postalCodeUnit}`,
        SK: `#PROGRAMME#${input[0].programmeName}`,
      });
    });
  });
});
