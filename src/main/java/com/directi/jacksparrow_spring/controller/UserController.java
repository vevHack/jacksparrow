package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import com.directi.jacksparrow_spring.service.JacksparrowValidator;
import com.directi.jacksparrow_spring.util.UserToMapConverter;
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

    private @Autowired JacksparrowValidator validator;
    private @Autowired Authorizer authorizer;
    private @Autowired UserRepository userRepository;
    private @Autowired UserToMapConverter userToMapConverter;


    @RequestMapping("/followers")
    @ResponseBody
    public Map followers(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("followers", userRepository.getFollowers(
                    userRepository.findById(user)));
        }};
    }

    @RequestMapping("/following")
    @ResponseBody
    public Map following(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("following", userRepository.getFollowing(
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



    @RequestMapping("/posts")
    @ResponseBody
    public Map<?, ?> getPosts(@RequestParam final int user) {
        return new HashMap<String, Object>() {{
            put("posts", userRepository.getPosts(new User() {{
                setId(user);
            }}));
        }};
    }

    @RequestMapping("/find")
    @ResponseBody
    public Map<?, ?> findUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        User user = null;

        if (username != null && email != null) {
            user = userRepository.getUserHavingUsername(username);
            if (user.getId()
                    != userRepository.getUserHavingEmail(email).getId()) {
                user = null;
            }
        } else if (username == null) {
            user = userRepository.getUserHavingEmail(email);
        } else if (email == null) {
            user = userRepository.getUserHavingUsername(username);
        }

        return userToMapConverter.convert(user);
    }

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

}
