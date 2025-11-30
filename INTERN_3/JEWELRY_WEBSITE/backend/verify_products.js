// Verification script for product endpoints
const fetch = require('node-fetch');
const API_URL = 'http://localhost:5000/api';

async function fetchAllProducts() {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error(`Failed to fetch all products: ${res.status}`);
  const data = await res.json();
  return data.data.products;
}

async function verifyProduct(product) {
  try {
    const detailRes = await fetch(`${API_URL}/products/${product._id}`);
    const text = await detailRes.text();
    if (!detailRes.ok) {
      console.log(`  ❌ FAILED: ${detailRes.status} - ${text}`);
    } else {
      console.log('  ✅ OK');
    }
  } catch (e) {
    console.log('  ❌ FAILED:', e.message);
  }
}

(async () => {
  console.log('Fetching all products...');
  try {
    const products = await fetchAllProducts();
    console.log(`Found ${products.length} products.`);
    for (const p of products) {
      console.log(`Checking product: ${p.title} (${p._id})...`);
      await verifyProduct(p);
    }
  } catch (e) {
    console.error('Error during verification:', e);
  }
})();
