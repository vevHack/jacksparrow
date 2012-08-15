dbname := jacksparrow
dbparams := `cat db/pgparams` 

test:
	@./node_modules/.bin/mocha --growl

# After a git pull, the symlinks to the mocha binary are not mainitained
# This is a command to manually restore them
npm-restore-links:
	@ln -f -s -t node_modules/.bin/ \
		`readlink --canonicalize node_modules/uglify-js/bin/uglifyjs`
	@for f in mocha _mocha ; \
	do \
		ln -f -s -t node_modules/.bin/ \
			`readlink --canonicalize node_modules/mocha/bin/$$f` ; \
	done


db-backup-schema:
	@pg_dump ${dbparams} --schema-only --create ${dbname} >db/schema.sql 

db-backup-test:
	@pg_dump ${dbparams} --schema-only --create ${dbname} >db/schema.sql && \
		pg_dump ${dbparams} --data-only --create ${dbname} >db/testdb.sql 

db-restore-schema:
	@dropdb ${dbparams} --interactive ${dbname} && \
		psql ${dbparams} -f db/schema.sql

db-restore-test:
	@dropdb ${dbparams} --interactive ${dbname} && \
		psql ${dbparams} -f db/schema.sql && \
		psql ${dbparams} jacksparrow -f db/testdb.sql

lo-slow:
	@tc qdisc add dev lo root handle 1: htb default 12 && \
		tc class add dev lo parent 1:1 classid 1:12 htb rate 56kbps ceil 64kbps && \
		tc qdisc add dev lo parent 1:12 netem delay 200ms

lo-reset:
	@tc qdisc del dev lo root

setup:
	@bash scripts/setup-servers.sh
	@bash scripts/generate-certs.sh

build:
	@bash scripts/create-static-resources.sh
	@bash scripts/build.sh

start:
	@bash scripts/jetty.sh start 1
	@bash scripts/jetty.sh start 2
	@bash scripts/nginx.sh start
	@bash scripts/notify.sh start

stop:
	@bash scripts/notify.sh stop
	@bash scripts/nginx.sh stop
	@bash scripts/jetty.sh stop 2
	@bash scripts/jetty.sh stop 1

.PHONY: test \
	npm-restore-links \
	db-backup-schema db-backup-test db-restore-schema db-restore-test \
	lo-slow lo-reset \
	setup build start stop

