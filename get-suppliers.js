// Save this as: netlify/functions/get-suppliers.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE_ID = 'appxU50VzUzCm4dSR';
    const TABLE_NAME = 'Suppliers';

    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`,
      {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`
        }
      }
    );

    const data = await response.json();

    // Filter only published suppliers
    const published = data.records
      .filter(record => record.fields.Publisert === true)
      .map(record => ({
        id: record.id,
        name: record.fields.Navn || '',
        category: record.fields.Category || '',
        location: record.fields.Lokasjon || '',
        description: record.fields.Description || '',
        contact: record.fields.Contact || '',
        image: record.fields.Image?.[0]?.url || null,
        slug: record.fields.Slug || ''
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ suppliers: published })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch suppliers' })
    };
  }
};
