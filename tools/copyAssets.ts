import * as shell from 'shelljs';

// Copy all the view templates
shell.cp('-R', 'src/views', 'dist/');
shell.mkdir('dist/database');
shell.cp('-R', 'src/database/config', 'dist/database/');
shell.cp('-R', 'src/database/migrations', 'dist/database/');
shell.cp('-R', 'src/database/seeders', 'dist/database/');
shell.cp('-R', 'src/database/.sequelizerc', 'dist/database/');
shell.mkdir('dist/public');
shell.cp('-R', 'src/public/assets', 'dist/public');
shell.mkdir('dist/public/pdf2html');
shell.cp('-R', 'pdf2htmlEX_data', 'dist/');
