package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/user/")
@SuppressWarnings("unchecked")
public class UserController {

    private @Autowired Authorizer authorizer;
    private @Autowired UserRepository userRepository;


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


    @RequestMapping("/feed")
    @ResponseBody
    public Map feed() throws UserAuthorizationException {
        return new HashMap() {{
            put("feed", userRepository.feedOf(authorizer.getAuthorizedUser()));
        }};
    }

    @RequestMapping("/posts")
    @ResponseBody
    public Map posts(@RequestParam final int user)
            throws EntityNotFoundException {
        return new HashMap() {{
            put("posts", userRepository.postsOf(userRepository.findById(user)));
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

    /*
    @RequestMapping(value = "/username")
    @ResponseBody
    public Map<?, ?> getUsernameFromID(@RequestParam int id)
            throws PreconditionViolatedException {

        if (!userRepository.existsUserWithId(id)) {
            throw new PreconditionViolatedException("User does not exist");
        }

        final User user = userRepository.getUserHavingId(id);
        return new HashMap<String, Object>() {{
            put("username", user.getUsername());
        }};
    }
    */

}
