/*
 * Thanks dude!
 * http://stephenbelanger.com/2011/09/21/how-to-make-socket-io-work-behind-nginx-mostly/
 *
 */

exports.apply = function (io) {

    io.configure(function() {  
        io.set("transports", ["xhr-polling"]);  
        io.set("polling duration", 10);  

        var path = require('path');  
        var HTTPPolling = require(path.join(  
            path.dirname(require.resolve('socket.io')),'lib', 'transports','http-polling')  
        );  
        var XHRPolling = require(path.join(  
            path.dirname(require.resolve('socket.io')),'lib','transports','xhr-polling')  
        );  

        XHRPolling.prototype.doWrite = function(data) {  
            HTTPPolling.prototype.doWrite.call(this);  

            var headers = {  
                'Content-Type': 'text/plain; charset=UTF-8',  
                'Content-Length': (data && Buffer.byteLength(data)) || 0  
            };  

            if (this.req.headers.origin) {  
                headers['Access-Control-Allow-Origin'] = '*';  
                if (this.req.headers.cookie) {  
                    headers['Access-Control-Allow-Credentials'] = 'true';  
                }  
            }  

            this.response.writeHead(200, headers);  
            this.response.write(data);  
            this.log.debug(this.name + ' writing', data);  
        }; 
    });
};
