#Justfile
set dotenv-load

DB_SERVICE := 'db'
DB_USER := 'root'
DB_NAME := 'phenix_mysql'
DB_PASS := `echo $MYSQL_PASSWORD`

opencageKey:=`echo $opencageKey`
googleApiKey:=`echo $googleApiKey`

@_wait_for_mysql:
  @echo "Waiting for MySQL server to be ready..."
  docker compose exec {{DB_SERVICE}} sh -c 'until mysqladmin ping -u{{DB_USER}} --silent; do sleep 1; done'
  @echo "MySQL server is alive. Now waiting for database '{{DB_NAME}}' to exist..."


@_insert_initial_data:
  @echo "--- Inserting initial data into {{DB_NAME}} on {{DB_SERVICE}} ---"
  docker compose exec {{DB_SERVICE}} sh -c "mysql -u {{DB_USER}} -p={{DB_PASS}} {{DB_NAME}} -e '\
  UPDATE api_keys SET apiKey=\"{{opencageKey}}\" WHERE id=\"opencage_key\"; \
  UPDATE api_keys SET apiKey=\"{{googleApiKey}}\" WHERE id=\"google_maps_key\";'"
  @echo "API keys updated from environment variables."

@default:
  @just --list


print:
    echo {{DB_PASS}}

build:
  rm -rf database/db_data
  docker compose down -v --remove-orphans
  docker compose up -d --build

build_db:
  docker compose down db -v --remove-orphans
  rm -rf database/db_data
  docker compose up -d db
  #just _wait_for_mysql
  #just _insert_initial_data