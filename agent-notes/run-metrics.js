#!/usr/bin/env node

/**
 * Follohjelp Metrics Fetcher
 * 
 * Fetches metrics from secure API endpoint and saves snapshot.
 * 
 * Env vars required:
 *   - METRICS_URL: The API endpoint URL (default: http://localhost:3000/api/metrics)
 *   - METRICS_TOKEN: Bearer token for authorization
 * 
 * Usage:
 *   METRICS_URL=https://follohjelp.vercel.app/api/metrics METRICS_TOKEN=xxx node run-metrics.js
 * 
 * Or with defaults (local dev):
 *   METRICS_TOKEN=xxx node run-metrics.js
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const METRICS_URL = process.env.METRICS_URL || 'http://localhost:3000/api/metrics';
const METRICS_TOKEN = process.env.METRICS_TOKEN;

// Validate required env vars
if (!METRICS_TOKEN) {
  console.error('❌ ERROR: METRICS_TOKEN environment variable is required');
  console.error('   Set it with: export METRICS_TOKEN=your-token-here');
  console.error('   Get token from: web/.env.local');
  process.exit(1);
}

console.log('📊 Follohjelp Metrics Fetcher');
console.log('==============================');
console.log(`📡 URL: ${METRICS_URL}`);

// Generate output path
const today = new Date().toISOString().split('T')[0];
const outDir = path.join(__dirname, 'out');
const snapshotPath = path.join(outDir, `${today}.json`);

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function fetchMetrics() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(METRICS_URL, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${METRICS_TOKEN}`,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      const statusText = response.statusText;
      console.error(`❌ ERROR: API returned ${status} ${statusText}`);
      process.exit(1);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeout);
    
    if (error.name === 'AbortError') {
      console.error('❌ ERROR: Request timed out after 30 seconds');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ ERROR: Connection refused - is the server running?');
      console.error('   Try: cd web && npm run dev');
    } else {
      console.error(`❌ ERROR: ${error.message}`);
    }
    process.exit(1);
  }
}

async function main() {
  console.log('⏳ Fetching metrics...');
  
  const metrics = await fetchMetrics();
  
  console.log('✅ Metrics received');
  console.log('💾 Saving snapshot...');

  // Save snapshot with full response
  fs.writeFileSync(snapshotPath, JSON.stringify(metrics, null, 2));
  console.log(`📁 Snapshot saved: ${snapshotPath}`);

  // Generate summary for notes.md
  const summary = generateSummary(metrics, today);
  
  // Append to notes.md
  const notesPath = path.join(__dirname, 'notes.md');
  const timestamp = new Date().toISOString();
  
  const notesEntry = `\n---\n## Metrics Snapshot: ${today}\n\n${summary}\n\n*Fetched: ${timestamp}*\n`;
  
  fs.appendFileSync(notesPath, notesEntry);
  console.log('📝 Summary appended to notes.md');

  // Output summary
  console.log('\n📈 Metrics Summary:');
  console.log(summary);
  
  console.log('\n✅ Done!');
}

function generateSummary(metrics, date) {
  const lines = [];
  const kpis = metrics.kpis || metrics;
  
  // Map API response to readable KPIs
  if (kpis.leads_created_30d !== undefined) {
    lines.push(`- **Leads Created (30d):** ${kpis.leads_created_30d}`);
  }
  
  if (kpis.providers_active !== undefined) {
    lines.push(`- **Active Providers:** ${kpis.providers_active}`);
  }
  
  if (kpis.providers_with_email_active !== undefined) {
    lines.push(`- **Active Providers with Email:** ${kpis.providers_with_email_active}`);
  }
  
  if (kpis.leads_with_assigned_providers_30d !== undefined) {
    lines.push(`- **Leads with Assigned Providers (30d):** ${kpis.leads_with_assigned_providers_30d}`);
  }
  
  if (kpis.match_rate_30d !== undefined) {
    lines.push(`- **Match Rate (30d):** ${(kpis.match_rate_30d * 100).toFixed(1)}%`);
  }
  
  if (metrics.generatedAt !== undefined) {
    lines.push(`- **API Timestamp:** ${metrics.generatedAt}`);
  }
  
  // Check for anomalies
  const anomalies = [];
  
  if (kpis.providers_active === 0) {
    anomalies.push('⚠️ No active providers found');
  }
  
  if (kpis.match_rate_30d !== undefined && kpis.match_rate_30d < 0.05) {
    anomalies.push('⚠️ Match rate below 5%');
  }
  
  if (kpis.leads_created_30d === 0 && kpis.providers_active > 0) {
    anomalies.push('⚠️ No leads but providers exist - possible funnel issue');
  }
  
  if (anomalies.length > 0) {
    lines.push('\n**Anomalies:**');
    anomalies.forEach(a => lines.push(`  ${a}`));
  }
  
  return lines.join('\n');
}

main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
