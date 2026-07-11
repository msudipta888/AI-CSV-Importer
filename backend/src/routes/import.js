const express = require('express');
const router = express.Router();
const { normalizeRows } = require('../services/csvParser');
const { extractBatchWithRetry, delay } = require('../services/aiExtractor');
const { validateAndCleanRow } = require('../services/validator');

router.post('/import', async (req, res) => {
  try {
    const { rows } = req.body;
    if (!rows || !Array.isArray(rows)) {
      return res.status(400).json({ error: "Invalid request body. Expected 'rows' array." });
    }

    if (rows.length === 0) {
      return res.json({
        imported: [],
        skipped: [],
        total_imported: 0,
        total_skipped: 0
      });
    }

    const normalizedRows = normalizeRows(rows);
    const BATCH_SIZE = 15;
    const finalImported = [];
    const finalSkipped = [];

    for (let i = 0; i < normalizedRows.length; i += BATCH_SIZE) {
      const batch = normalizedRows.slice(i, i + BATCH_SIZE);

      if (i > 0) {
        await delay(2000);
      }

      const aiResult = await extractBatchWithRetry(batch);

      // Post-process AI's imported leads
      if (aiResult.imported && Array.isArray(aiResult.imported)) {
        for (const row of aiResult.imported) {
          const validation = validateAndCleanRow(row);
          if (validation.isValid) {
            finalImported.push(validation.cleanedRow);
          } else {
            // Find corresponding original row in current batch
            const originalRow = batch.find(r => {
              const rEmail = r.email || r.Email || r.EMAIL || "";
              const rName = r.name || r.Name || r.NAME || "";
              const rMobile = r.mobile || r.Mobile || r.MOBILE || r.phone || r.Phone || r.PHONE || "";
              return (rEmail && row.email && String(rEmail).trim() === String(row.email).trim()) ||
                (rName && row.name && String(rName).trim() === String(row.name).trim()) ||
                (rMobile && row.mobile_without_country_code && String(rMobile).includes(row.mobile_without_country_code));
            }) || batch[0] || {};

            finalSkipped.push({
              original_row: originalRow,
              reason: validation.reason
            });
          }
        }
      }

      // Post-process AI's skipped leads
      if (aiResult.skipped && Array.isArray(aiResult.skipped)) {
        for (const skipItem of aiResult.skipped) {
          finalSkipped.push({
            original_row: skipItem.original_row || {},
            reason: skipItem.reason || "Skipped by AI mapping model"
          });
        }
      }
    }

    res.json({
      imported: finalImported,
      skipped: finalSkipped,
      total_imported: finalImported.length,
      total_skipped: finalSkipped.length
    });

  } catch (error) {
    console.error("Error in POST /api/import:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
