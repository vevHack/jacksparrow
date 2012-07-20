package com.directi.jacksparrow_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/user")
public class UserController {
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @RequestMapping(produces = "application/json")
    @ResponseBody
    public String onUser() {
        return jdbcTemplate.queryForList("SHOW ALL").toString();
    }

    @RequestMapping("list")
    @ResponseBody
    public List<Map<String, Object>> listUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM \"user\"");
    }
}
