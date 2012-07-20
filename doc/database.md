# PostgreSQL 9.1.4 #

### Installation ###

    $ sudo apt-get install postgressql
    $ sudo apt-get install postgresql-client
    $ service postgresql status
    Running clusters: 9.1/main
    $ uname -a
    Linux inferno 3.2.0-26-generic #41-Ubuntu SMP Thu Jun 14 17:49:24 UTC 2012 x86_64 x86_64 x86_64 GNU/Linux
    $ sudo -u postgres psql
    # \password
    ...change password...
    ...
    $ psql -U postgres -h localhost

### Restore Schema ###

    $ createdb -U postgres -h localhost jacksparrow
    $ psql -U postgres -h localhost jacksparrow -f db-schema.sql

### Hack Away! ###

    $ psql -U postgres -h localhost jacksparrow

### Backup Schema ###

    $ pg_dump -U postgres -h localhost --schema-only jacksparrow >db-schema.sql

