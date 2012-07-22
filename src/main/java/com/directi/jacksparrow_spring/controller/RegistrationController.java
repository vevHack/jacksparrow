package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/register")
public class RegistrationController extends ControllerWithJdbcWiring {

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public void onRegister(@RequestParam String email,
                      @RequestParam String password) {
        jdbcTemplate.update("INSERT into \"user\" (email, password) " +
                "VALUES (?, ?)", email, password);
    }

}
