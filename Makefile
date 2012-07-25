dbname := jacksparrow
dbparams := `cat db/pgparams` 

test:
	@./node_modules/.bin/mocha --growl

# After a git pull, the symlinks to the mocha binary are not mainitained
# This is a command to manually restore them
npm-restore-links:
	@for f in mocha _mocha ; \
	do \
		ln -f -s -t node_modules/.bin/ \
			`readlink --canonicalize node_modules/mocha/bin/$f` ; \
	done


db-backup-schema:
	@pg_dump ${dbparams} --schema-only --create ${dbname} >db/schema.sql 

db-backup-test:
	@pg_dump ${dbparams} --create ${dbname} >db/testdb.sql 

db-restore-schema:
	@dropdb ${dbparams} --interactive ${dbname} && \
		psql ${dbparams} -f db/schema.sql

db-restore-test:
	@dropdb ${dbparams} --interactive ${dbname} && \
		psql ${dbparams} -f db/testdb.sql



.PHONY: test \
	npm-restore-links \
	db-backup-schema db-backup-test db-restore-schema db-restore-test
