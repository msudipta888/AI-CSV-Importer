const { validateAndCleanRow } = require('../services/validator');

const validRow = {
  created_at: '2026-05-13 14:20:48',
  name: 'John Doe',
  email: 'john@example.com',
  country_code: '+91',
  mobile_without_country_code: '9876543210',
  company: 'GrowEasy',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  lead_owner: 'test@gmail.com',
  crm_status: 'GOOD_LEAD_FOLLOW_UP',
  crm_note: 'Interested',
  data_source: 'eden_park',
  possession_time: '',
  description: '',
};

describe('validator - validateAndCleanRow', () => {

  describe('Valid lead rows', () => {
    test('accepts a fully valid row and returns isValid=true', () => {
      const result = validateAndCleanRow(validRow);
      expect(result.isValid).toBe(true);
      expect(result.cleanedRow).toBeDefined();
    });

    test('passes row that has email but no mobile', () => {
      const row = { ...validRow, mobile_without_country_code: '' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(true);
    });

    test('passes row that has mobile but no email', () => {
      const row = { ...validRow, email: '' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Skip rule: no email AND no mobile', () => {
    test('skips row with both email and mobile empty', () => {
      const row = { ...validRow, email: '', mobile_without_country_code: '' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('No email or mobile number found');
    });

    test('skips row with both email and mobile whitespace-only', () => {
      const row = { ...validRow, email: '   ', mobile_without_country_code: '   ' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(false);
    });
  });

  describe('Enum validation', () => {
    test('blanks out invalid crm_status', () => {
      const row = { ...validRow, crm_status: 'SUPER_HOT_LEAD' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(true);
      expect(result.cleanedRow.crm_status).toBe('');
    });

    test('accepts all valid crm_status values', () => {
      const valid = ['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE'];
      valid.forEach(status => {
        const result = validateAndCleanRow({ ...validRow, crm_status: status });
        expect(result.cleanedRow.crm_status).toBe(status);
      });
    });

    test('blanks out invalid data_source', () => {
      const row = { ...validRow, data_source: 'facebook_ads' };
      const result = validateAndCleanRow(row);
      expect(result.isValid).toBe(true);
      expect(result.cleanedRow.data_source).toBe('');
    });

    test('accepts all valid data_source values', () => {
      const valid = ['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots'];
      valid.forEach(source => {
        const result = validateAndCleanRow({ ...validRow, data_source: source });
        expect(result.cleanedRow.data_source).toBe(source);
      });
    });

    test('passes through empty string for both enums (no confident match)', () => {
      const row = { ...validRow, crm_status: '', data_source: '' };
      const result = validateAndCleanRow(row);
      expect(result.cleanedRow.crm_status).toBe('');
      expect(result.cleanedRow.data_source).toBe('');
    });
  });

  describe('Newline escaping (CSV safety)', () => {
    test('escapes actual newlines in crm_note', () => {
      const row = { ...validRow, crm_note: 'Call back\nPrefers evenings' };
      const result = validateAndCleanRow(row);
      expect(result.cleanedRow.crm_note).toBe('Call back\\nPrefers evenings');
    });

    test('escapes Windows-style CRLF newlines', () => {
      const row = { ...validRow, description: 'Line1\r\nLine2' };
      const result = validateAndCleanRow(row);
      expect(result.cleanedRow.description).toBe('Line1\\nLine2');
    });

    test('escapes newlines in any text field', () => {
      const row = { ...validRow, company: 'GrowEasy\nInc' };
      const result = validateAndCleanRow(row);
      expect(result.cleanedRow.company).toBe('GrowEasy\\nInc');
    });
  });

  describe('Schema completeness', () => {
    test('output contains all 15 CRM schema fields', () => {
      const schemaFields = [
        'created_at', 'name', 'email', 'country_code', 'mobile_without_country_code',
        'company', 'city', 'state', 'country', 'lead_owner', 'crm_status',
        'crm_note', 'data_source', 'possession_time', 'description'
      ];
      const result = validateAndCleanRow(validRow);
      schemaFields.forEach(field => {
        expect(result.cleanedRow).toHaveProperty(field);
      });
    });

    test('null/undefined fields are converted to empty string in output', () => {
      const row = { ...validRow, company: null, city: undefined };
      const result = validateAndCleanRow(row);
      expect(result.cleanedRow.company).toBe('');
      expect(result.cleanedRow.city).toBe('');
    });
  });
});
