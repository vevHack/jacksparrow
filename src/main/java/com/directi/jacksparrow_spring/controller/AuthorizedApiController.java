package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.ApiException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.model.Feed;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.PostRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.util.FeedToMapConverter;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController {

    private final Log log = LogFactory.getLog(this.getClass());

    private @Autowired HttpServletRequest request;
    private @Autowired PostRepository postRepository;
    private @Autowired UserRepository userRepository;
    private @Autowired FeedToMapConverter feedToMapConverter;

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

        List<Feed> feedList = userRepository.getFeed(new User(){{
            setId(user);
        }});

        final List<Map<String, Object>> feeds =
                new ArrayList<Map<String, Object>>();

        for (Feed feed:feedList) {
            feeds.add(feedToMapConverter.convert(feed));
        }

        return new HashMap<String, Object>() {{
            put("feeds",feeds);
        }};
    }

    @RequestMapping(value = "/follow", method = RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> follow(
            @RequestParam(value="user") final int userId)
            throws ApiException, PreconditionViolatedException {
        log.info("User "+ getAuthorizedUser().getId()+"" +
                " wants to follow user "+userId);
        User user = userRepository.getUserHavingId(userId);
        if (user == null) {
            throw new PreconditionViolatedException(
                    "Followee does not exist");
        }

        userRepository.updateFollow(getAuthorizedUser(), user);

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
