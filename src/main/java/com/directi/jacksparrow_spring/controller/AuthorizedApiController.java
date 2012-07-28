package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.ApiException;
import com.google.common.collect.ImmutableMap;
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
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController extends ControllerWithJdbcWiring {

    private final Log log = LogFactory.getLog(this.getClass());

    private @Autowired HttpServletRequest request;

    private int getAuthorizedUser() {
        return (Integer)request.getAttribute("authorizedUser");
    }

    int authorizedUser=5;
    Queries query;

    @Autowired
    public void setQuery(Queries query) {
        this.query = query;
    }

    @RequestMapping("/feed")
    @ResponseBody
    public Map<String, Object> getFeed(@RequestParam final int user)
        throws ApiException {
        log.info("Request for feed of user "+user);
        if(user!=getAuthorizedUser()) {
            throw new ApiException(HttpStatus.PRECONDITION_FAILED,
                    "Authorized user and callee are different");
        }
        return new HashMap<String, Object>() {{
            put("feed", query.queryFeed(user));
        }};
    }

    @RequestMapping(value="/follow", method=RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> follow(@RequestParam int user)
        throws ApiException {
        log.info("User "+getAuthorizedUser()+" wants to follow user "+user);
        if(!query.existsUser(user))
            throw new ApiException(HttpStatus.PRECONDITION_FAILED,
                    "Followee does not exist");
        query.updateFollow((Integer)request.getAttribute("authorizedUser"), user);
        return new HashMap<String, Object>() {{
            put("status", "success");
        }};
    }

    @RequestMapping(value="/unfollow", method=RequestMethod.POST)
    @ResponseBody
    public HashMap<String, Object> unfollow(@RequestParam int user)
        throws ApiException{
        log.info("Unfollow request from user "+getAuthorizedUser()+" to unfollow user "+user);
        if(!query.isFollowing(getAuthorizedUser(), user))
            throw new ApiException(HttpStatus.PRECONDITION_FAILED,
                "follows relationship is required to unfollow");
        query.updateUnfollow((Integer)request.getAttribute("authorizedUser"), user);
        return new HashMap<String, Object>() {{
            put("status", "success");
        }};
    }

    @RequestMapping(value="/create", method=RequestMethod.POST)
    @ResponseBody
    public void create(@RequestParam String content)
            throws ApiException{
        log.info("create request from " + getAuthorizedUser());
        if (content.isEmpty()) {
            throw new ApiException(HttpStatus.PRECONDITION_FAILED,
                    "Content cannot be empty");
        }
        query.createPost(getAuthorizedUser(), content);
    }
}
