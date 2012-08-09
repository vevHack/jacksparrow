package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.BaseRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/user/")
@SuppressWarnings("unchecked")
public class UserController {

    private @Autowired Authorizer authorizer;
    private @Autowired UserRepository userRepository;
    private @Autowired BaseRepository baseRepository;


    @RequestMapping("/followers")
    @ResponseBody
    public Map followers(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("followers", userRepository.followers(
                    userRepository.findById(user)));
        }};
    }

    @RequestMapping("/following")
    @ResponseBody
    public Map following(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("following", userRepository.following(
                    userRepository.findById(user)));
        }};
    }


    @RequestMapping(value = "/follow", method = RequestMethod.POST)
    @ResponseBody
    public void follow(@RequestParam final int user)
            throws UserAuthorizationException, EntityNotFoundException,
            PreconditionViolatedException {
        userRepository.addFollower(
                authorizer.getAuthorizedUser(), userRepository.findById(user));
    }

    @RequestMapping(value = "/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public void unfollow(@RequestParam final int user)
            throws UserAuthorizationException, EntityNotFoundException,
            PreconditionViolatedException {
        userRepository.removeFollower(
                authorizer.getAuthorizedUser(), userRepository.findById(user));
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public void getAppointmentsForDay(
            @RequestParam @DateTimeFormat(iso= DateTimeFormat.ISO.DATE) Date day) {
        System.out.println(day);
    }

    @RequestMapping("/feed")
    @ResponseBody
    public Map feed(
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime upto)
            throws UserAuthorizationException {

        final Timestamp now = baseRepository.getCurrentTimestamp();
        final UserRepository.PostContainer postContainer =
                userRepository.feedOf(authorizer.getAuthorizedUser(),
                        upto == null ? now : new Timestamp(upto.getMillis()));

        return new HashMap() {{
            put("now", now);
            put("feed", postContainer.posts);
            put("from", postContainer.from);
        }};

    }

    @RequestMapping("/posts")
    @ResponseBody
    public Map posts(
            @RequestParam final int user,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime upto)
            throws EntityNotFoundException {

        final Timestamp now = baseRepository.getCurrentTimestamp();
        final UserRepository.PostContainer postContainer =
                userRepository.postsOf(userRepository.findById(user),
                        upto == null ? now : new Timestamp(upto.getMillis()));

        return new HashMap() {{
            put("now", now);
            put("posts", postContainer.posts);
            put("from", postContainer.from);
        }};

    }


    @RequestMapping("/find")
    @ResponseBody
    public Map findUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        User user = null;

        try {
            if (username != null && email != null) {
                user = userRepository.findByUsername(username);
                if (user.getId()
                        != userRepository.findByEmail(email).getId()) {
                    user = null;
                }
            } else if (username == null) {
                user = userRepository.findByEmail(email);
            } else if (email == null) {
                user = userRepository.findByUsername(username);
            }
        }catch (EntityNotFoundException ex) {
            user = null;
        }

        Map map = new HashMap();
        if (user != null) {
            map.put("user", user);
        }
        return map;
    }

    @RequestMapping("/details")
    @ResponseBody
    public Map details(@RequestParam("user") final List<Integer> users,
                       @RequestParam("field") final List<String> fields)
        throws PreconditionViolatedException, EntityNotFoundException {
        return new HashMap() {{
            put("users", userRepository.details(users, fields));
        }};
    }

}
