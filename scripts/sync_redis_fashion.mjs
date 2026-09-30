import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';

const dataDir = path.join(process.cwd(), 'src', 'data');
const jsonPath = path.join(dataDir, 'fashionCatalog.json');
const catalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

async function syncRedis() {
  console.log(`Connecting to Upstash Redis: ${process.env.UPSTASH_REDIS_REST_URL}...`);
  console.log(`Syncing ${catalog.length} products to Upstash Redis...`);
  await redis.set('fashion:catalog:master', JSON.stringify(catalog));
  console.log('🎉 Successfully synced Master Fashion Catalog to Upstash Redis under key: "fashion:catalog:master"!');
}

syncRedis().catch(err => console.error('Redis sync failed:', err.message));
