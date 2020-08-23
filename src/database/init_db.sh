#! /bin/bash
echo 'init_db script'
if [[ $NODE_ENV = "production" ]]; then
  FILE=database/dbs/.initialized
	if [ ! -f "$FILE" ]; then
	  echo ' db_init production'
	  npm run db_init
	  touch $FILE
	else
    echo 'db has beend initialized before.'
  fi
else
	FILE=src/database/dbs/.initialized
	if [ ! -f "$FILE" ]; then
	  echo 'db_init dev'
    npm run db_init:dev
    touch $FILE
  else
    echo 'db has beend initialized before.'
	fi
fi
