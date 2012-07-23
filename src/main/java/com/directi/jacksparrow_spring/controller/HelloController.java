package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/hello")
public class HelloController extends ControllerWithJdbcWiring {

    @RequestMapping()
    public ModelAndView onHello() {
        return new ModelAndView("hello") {{
            addObject("quality", "shorty");
            addObject("at", new java.util.Date());
        }};
    }

}
