# Test #

    $ ...install node.js...
    $ make test

## How did we get here ##

    $ ...install node.js and npm...
    $ npm install mocha should
    
    $ # try the simple method first
    $ npm install jquery
    $ # otherwise (a)
    $ npm install contextify@0.1.0 
    $ npm install htmlparser xmlhttprequest jsdom jquery

## Customization ##

We have made some changes (as a bug workaround) to `node_modules/jquery/lib/node-jquery.js` file:

    @@ -9429,6 +9429,7 @@
     })( window );


    +  window.JSON = JSON;
       window.jQuery.noConflict();
       return window.jQuery;
     }

and have raised an ([issue](https://github.com/coolaj86/node-jquery/issues/36))
on github.
