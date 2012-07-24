package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: harsh
 * Date: 24/7/12
 * Time: 1:01 PM
 * To change this template use File | Settings | File Templates.
 */


@Controller
@RequestMapping ("/api")
public class ApiController extends ControllerWithJdbcWiring {

    @RequestMapping(value="/follower", produces = "application/json", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> fetchFollowers (@RequestParam int user) {
        return jdbcTemplate.queryForList("SELECT follower FROM follows WHERE followee=?", user);
    }

    @RequestMapping(value="/followee", produces = "application/json", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> fetchFollowees (@RequestParam int user) {
        return jdbcTemplate.queryForList("SELECT followee FROM follows WHERE follower=?", user);
    }

    @RequestMapping(value="/users", produces = "application/json", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, Object>> fetchAllUsers () {
        return jdbcTemplate.queryForList("SELECT id FROM \"user\"");
    }

    @RequestMapping(value="/tweets", produces = "application/json", method = RequestMethod.GET)
    @ResponseBody
    public List <Map<String, Object>> fetchTweets (@RequestParam int user) {
        return jdbcTemplate.queryForList("SELECT id, content FROM post WHERE user_id=?", user);
    }


    @RequestMapping(value="/feed", produces = "application/json", method = RequestMethod.GET)
    @ResponseBody
    public List <Map<String, Object>> fetchFeed (@RequestParam int user) {
        return jdbcTemplate.queryForList("SELECT post FROM feed WHERE \"user\"=?", user);
    }


}
