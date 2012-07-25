package com.directi.jacksparrow_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UserController extends ControllerWithJdbcWiring {

    @RequestMapping("/{username}")
    public ModelAndView onUser(@PathVariable String username) {
        return new ModelAndView("base") {{
            addObject("title", "username -- XXX show name instead");
            addObject("loader", "user");
        }};
    }

    @RequestMapping("/{username}/{postId}")
    public ModelAndView onUserPost(@PathVariable String username,
                                   @PathVariable int postId) {
        //XXX ERROR CHECKING
        return new ModelAndView("base") {{
            addObject("title", "username -- XXX show name instead");
            addObject("loader", "post");
        }};
    }

}
