package com.directi.jacksparrow_spring.controller;

import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.concurrent.Immutable;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController extends ControllerWithJdbcWiring {

    int authorizedUser=1;
    Queries query;

    @Autowired
    public void setQuery(Queries query) {
        this.query = query;
    }

    @RequestMapping("/feed")
    @ResponseBody
    public List <Map<String, Object>> getFeed(@RequestParam int user) {
        return query.queryFeed(user);
    }

    @RequestMapping(value="/follow", method=RequestMethod.POST)
    @ResponseBody
    public ImmutableMap follow(@RequestParam int user) {
        query.updateFollow(authorizedUser, user);
        return ImmutableMap.of("status", "success");
    }

    @RequestMapping(value="/unfollow", method=RequestMethod.POST)
    @ResponseBody
    public ImmutableMap unfollow(@RequestParam int user) {
        query.updateUnfollow(authorizedUser, user);
        return ImmutableMap.of("status", "success");
    }

    @RequestMapping(value="/create", method=RequestMethod.POST)
    @ResponseBody
    public ImmutableMap create(@RequestParam int user, @RequestParam String content) {
        query.createPost(user, content);
        return ImmutableMap.of("status", "success");
    }
}
