/**
 * Required External Modules
 */
import app from './app';

import * as dotenv from 'dotenv';

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
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
