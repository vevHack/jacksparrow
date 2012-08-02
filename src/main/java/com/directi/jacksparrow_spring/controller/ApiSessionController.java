package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Session;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.SessionRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.util.AccessTokenCookieFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/session")
public class ApiSessionController {

    private static final String COOKIE_NAME = "API-ACT";

    private @Autowired UserRepository userRepository;
    private @Autowired SessionRepository sessionRepository;
    private @Autowired AccessTokenCookieFactory cookieFactory;

    @RequestMapping(value="/create", method=RequestMethod.POST)
    public Map<?,?> create(@RequestParam(value="user") final int userId,
                           @RequestParam String password,
                           HttpServletResponse response)
            throws UserAuthorizationException {

        User user = new User() {{
            setId(userId);
        }};
        userRepository.verifyUserWithCredentials(user, password);

        final Session session = sessionRepository.createNewSessionForUser(user);
        response.addCookie(
                cookieFactory.createApiAccessTokenCookie(
                        session.getAccessToken()));
        /* XXX bananas */
        return new HashMap<String, Object> () {{
            put("session", new HashMap<String, Object>() {{
                put("access_token", session.getAccessToken());
                put("user", session.getUser().getId());
            }});
        }};
    }

    @RequestMapping(value="/destroy", method=RequestMethod.POST)
    public void destroy(@CookieValue(value = COOKIE_NAME) String accessToken,
                        HttpServletResponse response) {
        sessionRepository.invalidateAccessToken(accessToken);
        response.addCookie(
                cookieFactory.purgeExistingApiAccessTokenCookieCookie());
    }

}
