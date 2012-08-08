## Partial list of external tools we used ##

* [http://colorschemedesigner.com/]()
* [http://ajaxload.info/]() (for `static/img/ajax-loader.gif`)
* For simulating slow connection (linux):

    $ sudo /sbin/tc qdisc add dev lo root netem delay 55msec
    $ # ... to check if slow ...
    $ ping localhost
    $ sudo /sbin/tc qdisc del dev lo root


