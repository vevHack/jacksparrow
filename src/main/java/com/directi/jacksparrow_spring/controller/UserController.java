package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.util.UserToMapConverter;
import com.directi.jacksparrow_spring.validator.JacksparrowValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/user/")
public class UserController {

    private @Autowired JacksparrowValidator validator;
    private @Autowired UserRepository userRepository;
    private @Autowired UserToMapConverter userToMapConverter;

    @RequestMapping("/followers")
    @ResponseBody
    public Map getFollowers(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("followers",
                    userRepository.getFollowers(userRepository.findById(user)));
        }};
    }

    @RequestMapping("/following")
    @ResponseBody
    public Map<?, ?> getFollowing(@RequestParam final int user) {
        return new HashMap<String, Object>() {{
            put("following", userRepository.getFollowing(new User() {{
                setId(user);
            }}));
        }};
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
