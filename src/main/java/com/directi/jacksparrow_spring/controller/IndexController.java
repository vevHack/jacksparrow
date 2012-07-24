package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class IndexController extends ControllerWithJdbcWiring {

    @RequestMapping()
    public ModelAndView onIndex() {
        return new ModelAndView("base") {{
            addObject("title", "Jack Sparrow");
            addObject("loader", "index");
        }};
    }

}
