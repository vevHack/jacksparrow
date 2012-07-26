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
    public HashMap<String, Object> follow(@RequestParam int user, HttpServletRequest request) {
        query.updateFollow((Integer)request.getAttribute("authorizedUser"), user);
        HashMap map =  new HashMap<String,Object>();
        map.put("status", "success");
        return map;
    }

    @RequestMapping(value="/unfollow", method=RequestMethod.POST)
    @ResponseBody
    public ImmutableMap unfollow(@RequestParam int user, HttpServletRequest request) {

        log.info("Unfollow request from user "+getAuthorizedUser()+" to unfollow user "+user);
        query.updateUnfollow((Integer)request.getAttribute("authorizedUser"), user);
        return ImmutableMap.of("status", "success");
    }

    @RequestMapping(value="/create", method=RequestMethod.POST)
    @ResponseBody
    public void create(@RequestParam int user, @RequestParam String content)
            throws ApiException{
        log.info("create request from " + getAuthorizedUser());
        if (content.isEmpty()) {
            throw new ApiException(HttpStatus.PRECONDITION_FAILED,
                    "Content cannot be empty");
        }
        query.createPost(user, content);
    }
}
