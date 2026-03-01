const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), '.next', 'cache');

if (fs.existsSync(cacheDir)) {
  console.log('Removing .next/cache directory...');
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('Cache directory removed successfully');
} else {
  console.log('No cache directory found');
}
