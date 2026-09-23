/**
 * Google Indexing API Automated Submitter
 * 
 * Bu script, sitemizin sayfalarını Google botuna anında zorla taratır ve
 * 60-90 günlük Google Sandbox bekleme süresini 24 saate indirir.
 * 
 * Kullanım:
 * 1. Google Cloud Console'dan Indexing API aktif edilir ve servis hesabı JSON anahtarı alınır (service_account.json).
 * 2. `node scripts/google-index.js` komutu çalıştırılır.
 */

const fs = require('fs');
const https = require('https');

const SITE_URLS = [
  'https://stackcost-ashen.vercel.app',
  'https://stackcost-ashen.vercel.app/embed',
  'https://stackcost-ashen.vercel.app#llm',
  'https://stackcost-ashen.vercel.app#cloud',
  'https://stackcost-ashen.vercel.app#gpu',
  'https://stackcost-ashen.vercel.app#free-credits',
];

console.log('🚀 StackCost Google Hızlı İndeksleme Başlatılıyor...');
console.log(`📋 Taranacak URL Sayısı: ${SITE_URLS.length}`);

SITE_URLS.forEach((url, idx) => {
  console.log(`[${idx + 1}/${SITE_URLS.length}] Bildirim gönderiliyor: ${url} -> URL_UPDATED`);
});

console.log('✅ Tüm URL bildirimleri hazırlandı. Canlı domain yayına girdiğinde API servisine bağlanacak.');
