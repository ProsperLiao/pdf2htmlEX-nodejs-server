/**
 * Required External Modules
 */
import * as dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line
import app from './app';

/**
 * App Variables
 */
if (
  !process.env.PORT ||
  !process.env.JWT_TOKEN_SECRET ||
  !process.env.JWT_REFRESH_TOKEN_SECRET ||
  !process.env.SEED_ADMIN_PASSWORD
) {
  console.log('.env has no definition of PORT or JWT_TOKEN_SECRET or JWT_REFRESH_TOKEN_SECRET or SEED_ADMIN_PASSWORD.');
  process.exit(1);
}

const PORT = parseInt(process.env.PORT);
/**
 * Server Activation
 */
app.listen(PORT, error => {
  if (error) {
    return console.log(error);
  }
  return console.log(`The server is listening on port ${PORT}`);
});
