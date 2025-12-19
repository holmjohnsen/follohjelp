# Follohjelp.no

Lokal katalog for håndverkere og tjenester i Follo-regionen.

## About
This is a local directory site for finding handymen and professional services in the Follo area (Drøbak, Ås, Ski, Vestby, Nesodden, Nordre Follo).

## Tech Stack
- Static HTML/CSS/JS
- Airtable as database
    - const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
    - const BASE_ID = 'appxU50VzUzCm4dSR';
    - const TABLE_NAME = 'Suppliers';
- Netlify Functions for secure API calls
- Deployed on Netlify

## Setup
The site automatically pulls published listings from Airtable and displays them with filtering by category and location.

Live site: https://follohjelp.no
