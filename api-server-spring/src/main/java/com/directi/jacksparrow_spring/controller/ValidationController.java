package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.ValidationException;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.JacksparrowValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/validate")
@SuppressWarnings("unchecked")
public class ValidationController {

    private @Autowired JacksparrowValidator validator;
    private @Autowired UserRepository userRepository;

    @RequestMapping()
    @ResponseBody
    public Map validate(
            @RequestParam(required=false) String username,
            @RequestParam(required=false) String email,
            @RequestParam(required=false) String password,
            @RequestParam(required=false) String content)
            throws ValidationException {

        int nonNullCount = 0;
        for (Object o: new Object[] {username, email, password, content}) {
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
            } else if (content != null) {
                validator.validateContent(content) ;
            }
            assert (false);
        } catch (final ValidationException ex) {
            return new HashMap() {{
                put("validation", new HashMap() {{
                    put("status", "failed");
                    put("reason", ex.getMessage());
                }});
            }};
        }

        return new HashMap() {{
            put("validation", new HashMap() {{
                put("status", "ok");
            }});
        }};
    }

}
