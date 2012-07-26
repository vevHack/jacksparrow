package com.directi.jacksparrow_spring.interceptor;

import com.directi.jacksparrow_spring.util.Error;
import com.directi.jacksparrow_spring.util.JsonSerializer;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class ApiAuthInterceptor extends HandlerInterceptorAdapter {

    private final Log log = LogFactory.getLog(this.getClass());

    static final String AUTH_TYPE = "Basic-Custom";

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private boolean unauthorizedAccess(
            HttpServletResponse response, final String message)
            throws IOException {
        int code = HttpStatus.UNAUTHORIZED.value();
        response.setStatus(code);
        new JsonSerializer().write(response, new Error(code, message).toMap());
        return false;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        log.info("Intercepted request: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        if (authHeader == null) {
            return unauthorizedAccess(response, "No 'Authorization' header");
        }

        String[] authTokens = authHeader.split("[ :]");
        if (authTokens.length != 3) {
            return unauthorizedAccess(response,
                    "Malformed 'Authorization' header");
        }

        if (!authTokens[0].trim().equals(AUTH_TYPE)) {
            return unauthorizedAccess(response,
                    "Expect Authorization type '" + AUTH_TYPE + "'");
        }

        int userId = Integer.parseInt(authTokens[1]);
        /* XXX Base64 encode the password */
        String password = authTokens[2];

        int count = jdbcTemplate.queryForInt(
                "SELECT count(*) FROM \"user\" WHERE id=? AND password=?",
                userId, password);
        if (count == 0) {
            return unauthorizedAccess(response, "Invalid credentials");
        }

        request.setAttribute("authorizedUser", userId);
        return true;
    }
}
