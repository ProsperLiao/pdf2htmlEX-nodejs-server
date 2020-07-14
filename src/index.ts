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

// I'm just browsing this repo but wanted to comment that you can use any CLI tool from Node with the built-in child_process module. This is an important thing to know doing Node development.
//
// quick demo:
//
//     const { exec, /* or spawn */ } = require('child_process')
// exec('pdf2htmlEX [options] <input-filename> [<output-filename>]', callback)
// Longer explanations:
//     https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
//         https://nodejs.org/api/child_process.html
