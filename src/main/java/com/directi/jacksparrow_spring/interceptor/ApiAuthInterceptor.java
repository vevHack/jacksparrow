package com.directi.jacksparrow_spring.interceptor;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.repository.SessionRepository;
import com.directi.jacksparrow_spring.util.AccessTokenCookieFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class ApiAuthInterceptor extends HandlerInterceptorAdapter {

    private final Log log = LogFactory.getLog(this.getClass());

    private @Autowired SessionRepository sessionRepository;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        log.info("Intercepted request for Authorization: "
                + request.getRequestURI());

        String accessToken = null;
        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals(AccessTokenCookieFactory.COOKIE_NAME)) {
                accessToken = cookie.getValue();
                break;
            }
        }

        if (accessToken == null) {
            throw new UserAuthorizationException("Missing API Access Token");
        }

        request.setAttribute("authorizedUser",
                sessionRepository.getUserFromAccessToken(accessToken));

        return true;
    }
}
