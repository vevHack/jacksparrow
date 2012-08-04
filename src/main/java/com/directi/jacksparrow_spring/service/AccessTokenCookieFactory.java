package com.directi.jacksparrow_spring.service;

import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;

@Service
public class AccessTokenCookieFactory {
    public static final String COOKIE_NAME = "API-ACT";

    public Cookie createApiAccessTokenCookie(String accessToken) {
        Cookie cookie = new Cookie(COOKIE_NAME, accessToken);
        /* XXX Check if this works in IE9 */
        cookie.setMaxAge(Integer.MAX_VALUE);
        return cookie;
    }

    public Cookie purgeExistingApiAccessTokenCookieCookie() {
        Cookie cookie = new Cookie(COOKIE_NAME, null);
        cookie.setMaxAge(0);
        return cookie;
    }
}
