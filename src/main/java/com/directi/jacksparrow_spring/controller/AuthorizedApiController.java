package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.util.ErrorResponse;
import com.google.common.collect.ImmutableMap;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.concurrent.Immutable;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
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
    public Map<String, Object> getFeed(@RequestParam final int user,
            HttpServletResponse response
    ) {
        log.info("Request for feed of user "+user);
        if(user!=getAuthorizedUser())
            return new ErrorResponse(HttpStatus.PRECONDITION_FAILED,
                    "Authorized user and callee are different", response).respond();
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
    public Map<String, Object> create(
            @RequestParam int user,
            @RequestParam String content,
            HttpServletResponse response) {
        log.info("create request from " + getAuthorizedUser());
        if (content.isEmpty()) {
            return new ErrorResponse(HttpStatus.PRECONDITION_FAILED,
                    "Content cannot be empty", response).respond();
        }
        query.createPost(user, content);
        return null;
    }
}
