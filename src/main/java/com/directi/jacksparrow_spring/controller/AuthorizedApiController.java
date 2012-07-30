package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.ApiException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.PostRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController extends ControllerWithJdbcWiring {

    private final Log log = LogFactory.getLog(this.getClass());

    private @Autowired HttpServletRequest request;
    private @Autowired PostRepository postRepository;
    private @Autowired UserRepository userRepository;

    private User getAuthorizedUser() {
        return (User)request.getAttribute("authorizedUser");
    }

    @RequestMapping("/feed")
    @ResponseBody
    public Map<String, Object> getFeed(@RequestParam final int user)
            throws PreconditionViolatedException {

        log.info("Request for feed of user "+user);
        if(user!= getAuthorizedUser().getId()) {
            throw new PreconditionViolatedException(
                    "Authorized user and callee are different");
        }
        return new HashMap<String, Object>() {{
            put("feed", userRepository.getFeed(new User(){{
                setId(user);
            }}));
        }};
    }

    @RequestMapping(value="/follow", method=RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> follow(@RequestParam final int user)
            throws ApiException, PreconditionViolatedException {
        log.info("User "+ getAuthorizedUser().getId()+"" +
                " wants to follow user "+user);
        if(!userRepository.existsUserWithId(user))
            throw new PreconditionViolatedException(
                    "Followee does not exist");

        userRepository.updateFollow(getAuthorizedUser(), new User() {{
            setId(user);
        }});

        return new HashMap<String, Object>() {{
            put("status", "success");
        }};
    }

    @RequestMapping(value = "/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> unfollow(@RequestParam final int user)
            throws PreconditionViolatedException {
        log.info("Unfollow request from user " + getAuthorizedUser().getId()
                + " to unfollow user " + user);

        User authorizedUser = getAuthorizedUser();
        User userToUnfollow = new User() {{
            setId(user);
        }};

        if (!userRepository.isFollowing(authorizedUser, userToUnfollow)) {
            throw new PreconditionViolatedException(
                    "follows relationship is required to unfollow");
        }

        userRepository.updateUnfollow(authorizedUser, userToUnfollow);

        return new HashMap<String, Object>() {{
            put("status", "success");
        }};
    }

    @RequestMapping(value="/create", method=RequestMethod.POST)
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
