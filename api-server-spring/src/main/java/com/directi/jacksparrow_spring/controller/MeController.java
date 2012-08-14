package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/me")
@SuppressWarnings("unchecked")
public class MeController {

    private @Autowired Authorizer authorizer;
    private @Autowired UserRepository userRepository;

    @RequestMapping()
    @ResponseBody
    public Map me() throws EntityNotFoundException, UserAuthorizationException {
        /* XXX: inefficient? will run everytime */
        try {
            return new HashMap() {{
                put("user", userRepository.details(
                        Arrays.asList(new Integer[]{
                                authorizer.getAuthorizedUser().getId()
                        }),
                        Arrays.asList(new String[]{"username", "email", "name"}))
                        .get(0));
            }};
        } catch (PreconditionViolatedException ex) {
            throw new RuntimeException(ex);
        }
    }

}
