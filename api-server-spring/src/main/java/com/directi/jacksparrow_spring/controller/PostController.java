package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.exception.ValidationException;
import com.directi.jacksparrow_spring.repository.PostRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import com.directi.jacksparrow_spring.service.JacksparrowValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api/post")
@SuppressWarnings("unchecked")
public class PostController {

    private @Autowired JacksparrowValidator validator;
    private @Autowired PostRepository postRepository;
    private @Autowired Authorizer authorizer;

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public Map create(@RequestParam final String content)
            throws ValidationException, UserAuthorizationException {
        validator.validateContent(content);
        return new HashMap() {{
            put("post", postRepository.create(
                    authorizer.getAuthorizedUser(), content));
        }};
    }

}
