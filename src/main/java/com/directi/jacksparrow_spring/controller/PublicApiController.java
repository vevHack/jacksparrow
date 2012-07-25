package com.directi.jacksparrow_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping (value="/api/public", produces="application/json")
public class PublicApiController extends ControllerWithJdbcWiring {

    Queries query;

    @Autowired
    public void setQuery(Queries query) {
        this.query = query;
    }


    @RequestMapping("/followers")
    @ResponseBody
    public List<Map<String, Object>> getFollowers(@RequestParam int user) {
        return query.queryFollowers(user);
    }

    @RequestMapping("/following")
    @ResponseBody
    public List<Map<String, Object>> getFollowing(@RequestParam int user) {
        return query.queryFollowing(user);
    }

    @RequestMapping("/users")
    @ResponseBody
    public List<Map<String, Object>> getUsers() {
        return query.queryUsers();
    }

    @RequestMapping("/posts")
    @ResponseBody
    public List <Map<String, Object>> getPosts(@RequestParam int user) {
        return query.queryPosts(user);
    }

}
