package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping (value="/api/public", produces="application/json")
public class PublicApiController extends ControllerWithJdbcWiring {

    @RequestMapping("/followers")
    @ResponseBody
    public List<Map<String, Object>> getFollowers(@RequestParam int user) {
        return jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE followee=?", user);
    }

    @RequestMapping("/following")
    @ResponseBody
    public List<Map<String, Object>> getFollowing(@RequestParam int user) {
        return jdbcTemplate.queryForList(
                "SELECT followee FROM follows WHERE follower=?", user);
    }

    @RequestMapping("/users")
    @ResponseBody
    public List<Map<String, Object>> getUsers() {
        return jdbcTemplate.queryForList("SELECT id FROM \"user\"");
    }

    @RequestMapping("/posts")
    @ResponseBody
    public List <Map<String, Object>> getPosts(@RequestParam int user) {
        return jdbcTemplate.queryForList(
                "SELECT id, content FROM post WHERE user=?", user);
    }

}
