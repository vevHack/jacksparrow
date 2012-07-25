package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping (value="/api/auth", produces="application/json")
public class AuthorizedApiController extends ControllerWithJdbcWiring {

    @RequestMapping("/feed")
    @ResponseBody
    public List <Map<String, Object>> getFeed(@RequestParam int user) {
        return jdbcTemplate.queryForList(
                "SELECT post FROM feed WHERE \"user\"=?", user);
    }

    @RequestMapping(value="/follow", method=RequestMethod.POST)
    @ResponseBody
    public void follow(@RequestParam int user) {
    }

    @RequestMapping(value="/unfollow", method=RequestMethod.POST)
    @ResponseBody
    public void unfollow(@RequestParam int user) {
    }

    @RequestMapping(value="/create", method=RequestMethod.POST)
    @ResponseBody
    public void create(@RequestParam int user, @RequestParam String content) {
    }

}
