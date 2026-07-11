const ALLOWED_CRM_STATUS = new Set(['GOOD_LEAD_FOLLOW_UP', 'DID_NOT_CONNECT', 'BAD_LEAD', 'SALE_DONE']);
const ALLOWED_DATA_SOURCE = new Set(['leads_on_demand', 'meridian_tower', 'eden_park', 'varah_swamy', 'sarjapur_plots']);

/**
 * Validates a single row against enum schemas, skip rules, and escaping formatting.
 * @param {Object} row 
 * @returns {Object} { isValid: boolean, cleanedRow?: Object, reason?: string }
 */
function validateAndCleanRow(row) {
  const schemaKeys = [
    'created_at', 'name', 'email', 'country_code', 'mobile_without_country_code', 'company',
    'city', 'state', 'country', 'lead_owner', 'crm_status', 'crm_note', 'data_source',
    'possession_time', 'description'
  ];

  const cleaned = {};
  for (const key of schemaKeys) {
    const val = row[key];
    cleaned[key] = (val === null || val === undefined) ? "" : String(val);
  }

  // 1. Enforce crm_status whitelist
  const statusTrimmed = cleaned.crm_status.trim();
  if (statusTrimmed && !ALLOWED_CRM_STATUS.has(statusTrimmed)) {
    cleaned.crm_status = "";
  } else {
    cleaned.crm_status = statusTrimmed;
  }

  // 2. Enforce data_source whitelist
  const sourceTrimmed = cleaned.data_source.trim();
  if (sourceTrimmed && !ALLOWED_DATA_SOURCE.has(sourceTrimmed)) {
    cleaned.data_source = "";
  } else {
    cleaned.data_source = sourceTrimmed;
  }

  // 3. Enforce CSV safety: escape actual newlines in any text field as \n
  for (const key of schemaKeys) {
    if (cleaned[key]) {
      cleaned[key] = cleaned[key].replace(/\r?\n/g, '\\n');
    }
  }

  // 4. Enforce skip rules: no email AND no mobile
  const hasEmail = cleaned.email && cleaned.email.trim().length > 0;
  const hasMobile = cleaned.mobile_without_country_code && cleaned.mobile_without_country_code.trim().length > 0;

  if (!hasEmail && !hasMobile) {
    return {
      isValid: false,
      reason: "No email or mobile number found"
    };
  }

  return {
    isValid: true,
    cleanedRow: cleaned
  };
}

module.exports = {
  validateAndCleanRow
};
