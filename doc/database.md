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

### Create/Restore Schema ###

    $ doc/backup_schema.sh
    $ doc/restore_schema.sh

### Hack Away! ###

    $ psql -U postgres -h localhost jacksparrow
or

    $ psql `cat doc/pgparams` jacksparrow


