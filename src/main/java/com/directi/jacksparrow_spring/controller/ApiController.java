package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/api")
public class ApiController {

    @RequestMapping("/ping")
    @ResponseBody
    public Map<String, Object> sayHi() {
        return new HashMap<String, Object>() {{
            put("message", "Hi!");
            put("timestamp", new Timestamp(System.currentTimeMillis()));
        }};
    }

}
