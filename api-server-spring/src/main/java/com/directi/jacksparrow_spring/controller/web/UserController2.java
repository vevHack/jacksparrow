package com.directi.jacksparrow_spring.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class UserController2 {

    @RequestMapping("/{username}")
    public ModelAndView onUser(@PathVariable String username) {
        return new ModelAndView("base") {{
            addObject("loader", "user");
        }};
    }

    @RequestMapping("/{username}/{postId}")
    public ModelAndView onUserPost(@PathVariable String username,
                                   @PathVariable int postId) {
        return new ModelAndView("base") {{
            addObject("loader", "post");
        }};
    }

}
