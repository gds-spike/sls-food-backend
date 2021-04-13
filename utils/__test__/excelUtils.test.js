const { it, expect } = require('@jest/globals');
const { formatCsvWithConfig } = require('../excelUtils');

describe('excelUtilsTest', () => {
  describe('formatCsvWithConfig', () => {
    it('should format csv according to config', () => {
      const headers = [
        'no',
        'product',
        'name',
        'price',
        'dummyNumber',
        'dummyNumber2',
        'location',
        'category',
        'decimalColumn',
      ];
      const originalCsv = `1,"Eldon Base for stackable storage shelf, platinum",Muhammed MacIntyre,3,-213.25,38.94,35,Nunavut,Storage & Organization,0.8
      2,"1.7 Cubic Foot Compact ""Cube"" Office Refrigerators",Barry French,293,457.81,208.16,68.02,Nunavut,Appliances,0.58
      3,"Cardinal Slant-D� Ring Binder, Heavy Gauge Vinyl",Barry French,293,46.71,8.69,2.99,Nunavut,Binders and Binder Accessories,0.39
      4,R380,Clay Rozendal,483,1198.97,195.99,3.99,Nunavut,Telephones and Communication,0.58
      5,Holmes HEPA Air Purifier,Carlos Soltero,515,30.94,21.78,5.94,Nunavut,Appliances,0.5
      6,G.E. Longer-Life Indoor Recessed Floodlight Bulbs,Carlos Soltero,515,4.43,6.64,4.95,Nunavut,Office Furnishings,0.37
      7,"Angle-D Binders with Locking Rings, Label Holders",Carl Jackson,613,-54.04,7.3,7.72,Nunavut,Binders and Binder Accessories,0.38
      8,"SAFCO Mobile Desk Side File, Wire Frame",Carl Jackson,613,127.70,42.76,6.22,Nunavut,Storage & Organization,
      9,"SAFCO Commercial Wire Shelving, Black",Monica Federle,643,-695.26,138.14,35,Nunavut,Storage & Organization,
      10,Xerox 198,Dorothy Badders,678,-226.36,4.98,8.33,Nunavut,Paper,0.38`;

      const config = {
        trimTopRows: 2,
        headers,
      };

      const output = formatCsvWithConfig(originalCsv, config);

      // Output csv hould trim top rows
      expect(output.split('\n')).toHaveLength(10 - config.trimTopRows + 1);

      // Output csv Should contain headers
      expect(output.split('\n')[0].split(',')).toEqual(config.headers);
    });
  });
});
