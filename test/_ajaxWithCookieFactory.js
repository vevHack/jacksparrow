var $ = require("jquery");
var request = require("request");

/* node-jquery does not let us set the Cookie header, and neither 
 *  maintains the document.cookies
 * So this workaround of using the request module wherever cookies are a must
 */
function ajaxWithCookieFactory() {
    var jar = request.jar();

    return {

        addCookie: function(data) {
            jar.add(request.cookie(data));
        },

        getCookie: function(name) {
            var i, cookie;
            for (i = 0; i < jar.cookies.length; i += 1) {
                cookie = jar.cookies[i];
                if (cookie.name.localeCompare(name) === 0) {
                    return cookie.value;
                }
            }
        },

        go: function(jqParams) {
            var options = {};
            if (typeof jqParams === 'string') {
                options.url = jqParams;
            } else {
                options.url = jqParams.url;
                options.method = jqParams.type; 
                options.headers = jqParams.headers; 
                options[("POST".localeCompare(jqParams.type) === 0) ?
                    "form" : "qs"] = jqParams.data;
            }
            options.jar = jar;
            
            var deferred = $.Deferred();
            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if ("json".localeCompare(jqParams.dataType) === 0) {
                        body = JSON.parse(body);
                    }
                    deferred.resolve(body, "success", {});
                } else {
                    response.status = response.statusCode;
                    response.responseText = body;
                    deferred.reject(response, error);
                }
            });
            return deferred.promise();
        }
    }
}

module.exports = ajaxWithCookieFactory;
