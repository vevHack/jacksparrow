package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.PostRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController {

    private final Log log = LogFactory.getLog(this.getClass());

    private @Autowired HttpServletRequest request;
    private @Autowired PostRepository postRepository;
    private @Autowired UserRepository userRepository;

    private User getAuthorizedUser() {
        return (User)request.getAttribute("authorizedUser");
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public void create(@RequestParam final String content)
            throws PreconditionViolatedException {
        log.info("create request from " + getAuthorizedUser().getId());
        if (content.isEmpty()) {
            throw new PreconditionViolatedException(
                    "Content cannot be empty");
        }
        postRepository.createPost(new Post() {{
            setId(getAuthorizedUser().getId());
            setContent(content);
        }});
    }
}
