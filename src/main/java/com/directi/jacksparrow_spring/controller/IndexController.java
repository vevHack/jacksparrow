package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.util.LoginUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class IndexController extends ControllerWithJdbcWiring {

    private @Autowired LoginUtil loginUtil;

    @RequestMapping()
    public ModelAndView onIndex() {
        Integer userId = loginUtil.getLoggedInUserId();
        final String loader = (userId == null) ? "authenticate" : "index";
        return new ModelAndView("base") {{
            addObject("title", "Jack Sparrow");
            addObject("loader", loader);
        }};
    }

}
