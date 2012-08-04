package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Session;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.SessionRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import com.directi.jacksparrow_spring.service.AccessTokenCookieFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/session")
@SuppressWarnings("unchecked")
public class SessionController {

    private @Autowired UserRepository userRepository;
    private @Autowired SessionRepository sessionRepository;
    private @Autowired AccessTokenCookieFactory cookieFactory;
    private @Autowired Authorizer authorizer;

    @RequestMapping(value="/create", method=RequestMethod.POST)
    @ResponseBody
    public Map create(@RequestParam(value="user") final int userId,
                      @RequestParam String password,
                      HttpServletResponse response)
            throws UserAuthorizationException, EntityNotFoundException {

        User user = new User() {{
            setId(userId);
        }};
        userRepository.verifyCredentials(user, password);

        final Session session = sessionRepository.createNewSessionForUser(user);
        response.addCookie(
                cookieFactory.createApiAccessTokenCookie(
                        session.getAccessToken()));

        return new HashMap () {{
            put("session", session);
        }};
    }

    @RequestMapping(value="/destroy", method=RequestMethod.POST)
    public void destroy(HttpServletResponse response) {
        sessionRepository.invalidateAccessToken(authorizer.getAccessToken());
        response.addCookie(
                cookieFactory.purgeExistingApiAccessTokenCookieCookie());
    }

}
