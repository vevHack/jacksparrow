package com.directi.jacksparrow_spring.interceptor;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ApiAuthInterceptor extends HandlerInterceptorAdapter {

    private final Log log = LogFactory.getLog(this.getClass());

    static final String AUTH_TYPE = "Basic-Custom";

    private @Autowired UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        log.info("Intercepted request for Authorization: "
                + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            throw new UserAuthorizationException("No 'Authorization' header");
        }

        String[] authTokens = authHeader.split("[ :]");
        if (authTokens.length != 3) {
            throw new UserAuthorizationException(
                    "Malformed 'Authorization' header");
        }

        if (!authTokens[0].trim().equals(AUTH_TYPE)) {
            throw new UserAuthorizationException(
                    "Expect Authorization type '" + AUTH_TYPE + "'");
        }

        int userId = Integer.parseInt(authTokens[1]);
        /* XXX Base64 encode the password */
        String password = authTokens[2];

        request.setAttribute("authorizedUser",
                userRepository.getUserFromCredentials(userId, password));

        return true;
    }
}
