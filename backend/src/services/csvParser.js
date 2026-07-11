
function normalizeRows(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(row => {
    const cleanRow = {};
    for (const key of Object.keys(row)) {
      const cleanKey = key.trim();
      const val = row[key];
      cleanRow[cleanKey] = (typeof val === 'string') ? val.trim() : (val === null || val === undefined ? "" : val);
    }
    return cleanRow;
  });
}

module.exports = {
  normalizeRows
};
