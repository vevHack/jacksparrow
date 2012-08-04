package com.directi.jacksparrow_spring.service;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.SessionRepository;
import com.directi.jacksparrow_spring.util.AccessTokenCookieFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Service
public class Authorizer {
    private @Autowired HttpServletRequest request;
    private @Autowired SessionRepository sessionRepository;

    public User getAuthorizedUser()
        throws UserAuthorizationException {

        String accessToken = null;

        accessToken = request.getHeader("Authorization");
        if (accessToken != null) {
            String[] components = accessToken.split("\\s");
            if (components[0].equals(AccessTokenCookieFactory.COOKIE_NAME)) {
                accessToken = components[1];
            } else {
                accessToken = null;
            }
        }

        if (accessToken == null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals(AccessTokenCookieFactory.COOKIE_NAME)) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken == null) {
            throw new UserAuthorizationException("Missing API Access Token");
        }

        return sessionRepository.getUserFromAccessToken(accessToken);
    }
}
