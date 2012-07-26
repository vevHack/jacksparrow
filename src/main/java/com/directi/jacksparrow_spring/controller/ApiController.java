package com.directi.jacksparrow_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.SpringVersion;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class ApiController {

    private @Autowired JdbcTemplate jdbcTemplate;

    @RequestMapping("/ping")
    @ResponseBody
    public Map<String, Object> sayHi() {
        return new HashMap<String, Object>() {{
            put("message", "Hi!");
            put("timestamp", new Timestamp(System.currentTimeMillis()));
            put("version", new HashMap<String, Object>() {{
                put("spring", getSpringVersion());
                put("postgres", getPostgresVersion());
            }});
        }};
    }

    private String getPostgresVersion() {
        return (String)jdbcTemplate.queryForMap("SELECT VERSION()")
                .get("version");
    }

    private String getSpringVersion() {
        return new SpringVersion().getVersion();
    }

}
