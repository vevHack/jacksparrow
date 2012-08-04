package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.ValidationException;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.util.UserToMapConverter;
import com.directi.jacksparrow_spring.service.JacksparrowValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping (value="/api/public", produces="application/json")
public class PublicApiController {

    private @Autowired JacksparrowValidator validator;
    private @Autowired UserRepository userRepository;
    private @Autowired UserToMapConverter userToMapConverter;

    @RequestMapping("/followers")
    @ResponseBody
    public Map<String, Object> getFollowers(@RequestParam final int user) {
        return new HashMap<String, Object>(){{
            put("followers", userRepository.getFollowers(new User() {{
                setId(user);
            }}));
        }};
    }

    @RequestMapping("/following")
    @ResponseBody
    public Map<String, Object> getFollowing(@RequestParam final int user) {
        return new HashMap<String, Object>() {{
            put("following", userRepository.getFollowing(new User() {{
                setId(user);
            }}));
        }};
    }

    @RequestMapping("/posts")
    @ResponseBody
    public Map<String, Object> getPosts(@RequestParam final int user) {
        return new HashMap<String, Object>(){{
                put("posts",userRepository.getPosts(new User(){{
                    setId(user);
                }}));
        }};
    }

    @RequestMapping(value="/register", method=RequestMethod.POST)
    @ResponseBody
    public Map<?,?> register(@RequestParam final String username,
                             @RequestParam final String email,
                             @RequestParam final String password)
            throws ValidationException {

        final User user = new User() {{
            setUsername(validator.validateUsername(username));
            setEmail(validator.validateEmail(email));
            setPassword(validator.validatePassword(password));
        }};

        if (userRepository.getUserHavingUsername(username) != null) {
            throw new ValidationException(
                    "Username " + username + " already exists");
        }
        if (userRepository.getUserHavingEmail(email) != null) {
            throw new ValidationException(
                    "Email " + email + " already exists");
        }

        userRepository.addUser(user);

        return userToMapConverter.convert2(user);
    }

    @RequestMapping(value="/findUser")
    @ResponseBody
    public Map<?,?> findUser(
            @RequestParam(required=false) String username,
            @RequestParam(required=false) String email) {
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

    @RequestMapping(value="/validate")
    @ResponseBody
    public Map<?,?> validate(
            @RequestParam(required=false) String username,
            @RequestParam(required=false) String email,
            @RequestParam(required=false) String password)
        throws ValidationException {

        int nonNullCount = 0;
        for (Object o: new Object[] {username, email, password}) {
            if (o != null) {
                nonNullCount += 1;
            }
        }
        if (nonNullCount != 1) {
            throw new ValidationException(
                    "Require one and only one field for validation at a time");
        }

        try {
            if (username != null) {
                validator.validateUsername(username);
            } else if (email != null) {
                validator.validateEmail(email) ;
            } else if (password != null) {
                validator.validatePassword(password) ;
            }
            assert (false);
        } catch (final ValidationException ex) {
            return new HashMap<String, Object>() {{
                put("validation", new HashMap<String, Object>() {{
                    put("status", "failed");
                    put("reason", ex.getMessage());
                }});
            }};
        }

        return new HashMap<String, Object>() {{
            put("validation", new HashMap<String, Object>() {{
                put("status", "ok");
            }});
        }};
    }

    @RequestMapping(value = "/username")
    @ResponseBody
    public HashMap<String, Object> getUsernameFromID(@RequestParam int id)
            throws PreconditionViolatedException {

        if(!userRepository.existsUserWithId(id))
            throw new PreconditionViolatedException(
                    "User with the provided id does not exist");

        final User user = userRepository.getUserHavingId(id);
        return new HashMap<String, Object>(){{
            put("username", user.getUsername());
        }};
    }

}
