package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController extends ControllerWithJdbcWiring {

    @RequestMapping(produces = "application/json")
    @ResponseBody
    public String onUser() {
        return jdbcTemplate.queryForList("SHOW ALL").toString();
    }

}
