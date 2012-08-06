package com.directi.jacksparrow_spring.service;

import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;

@Service
public class AccessTokenCookieFactory {
    public static final String COOKIE_NAME = "API-ACT";
    public static int SECONDS_IN_YEAR = 31557600;

    public Cookie createApiAccessTokenCookieWithValueAndAge(
            String accessToken, int maxAge) {
        Cookie cookie = new Cookie(COOKIE_NAME, accessToken);
        /* XXX Check if this works in IE9 */
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");
        return cookie;
    }

    public Cookie createApiAccessTokenCookie(String accessToken) {
        return createApiAccessTokenCookieWithValueAndAge(
                accessToken, SECONDS_IN_YEAR);
    }

    public Cookie purgeExistingApiAccessTokenCookieCookie() {
        return createApiAccessTokenCookieWithValueAndAge(null, 0);
    }
}
