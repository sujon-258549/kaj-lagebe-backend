import app from './app.js';
import config from './app/config/index.js';

const port = config.port || 3000;

try {
  app.listen(port, () => {
    console.log(`⭐⭐  Example app listening on port ${port} ⭐⭐`);
  });
} catch (error) {
  console.error('Error starting server:', error);
  if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
  process.exit(1);
}