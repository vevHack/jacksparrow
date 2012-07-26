package com.directi.jacksparrow_spring.interceptor;

import com.directi.jacksparrow_spring.exception.ApiException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ApiAuthInterceptor extends HandlerInterceptorAdapter {

    private final Log log = LogFactory.getLog(this.getClass());

    static final String AUTH_TYPE = "Basic-Custom";

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        log.info("Intercepted request: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "No 'Authorization' header");
        }

        String[] authTokens = authHeader.split("[ :]");
        if (authTokens.length != 3) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "Malformed 'Authorization' header");
        }

        if (!authTokens[0].trim().equals(AUTH_TYPE)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "Expect Authorization type '" + AUTH_TYPE + "'");
        }

        int userId = Integer.parseInt(authTokens[1]);
        /* XXX Base64 encode the password */
        String password = authTokens[2];

        int count = jdbcTemplate.queryForInt(
                "SELECT count(*) FROM \"user\" WHERE id=? AND password=?",
                userId, password);
        if (count == 0) {
            throw new ApiException(HttpStatus.UNAUTHORIZED,
                    "Invalid credentials");
        }

        request.setAttribute("authorizedUser", userId);
        return true;
    }
}
