package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/users")
public class UsersController extends ControllerWithJdbcWiring {
    @RequestMapping(produces = "application/json")
    @ResponseBody
    public List<Map<String, Object>> listUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM \"user\"");
    }
}
