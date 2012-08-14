package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.ValidationException;
import com.directi.jacksparrow_spring.repository.UserRepository;
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
@RequestMapping("/register")
@SuppressWarnings("unchecked")
public class RegistrationController {

    private @Autowired JacksparrowValidator validator;
    private @Autowired UserRepository userRepository;

    @RequestMapping(method= RequestMethod.POST)
    @ResponseBody
    public Map register(@RequestParam final String username,
                        @RequestParam final String email,
                        @RequestParam final String password)
            throws ValidationException {

        validator.validateUsername(username);
        validator.validateEmail(email);
        validator.validatePassword(password);

        try {
            userRepository.findByUsername(username);
            throw new ValidationException(
                    "Username " + username + " already in use");
        } catch (EntityNotFoundException ex) {}

        try {
            userRepository.findByEmail(email);
            throw new ValidationException("Email " + email + " already in use");
        } catch (EntityNotFoundException ex) {}

        return new HashMap() {{
            put("user", userRepository.addUser(username, email, password));
        }};
    }

}
