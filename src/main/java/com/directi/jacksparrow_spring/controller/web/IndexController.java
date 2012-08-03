package com.directi.jacksparrow_spring.controller.web;

import com.directi.jacksparrow_spring.util.AccessTokenCookieFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/")
public class IndexController {

    @RequestMapping()
    public ModelAndView onIndex(
            @CookieValue(value= AccessTokenCookieFactory.COOKIE_NAME,
                    required = false) final String accessToken) {
        return new ModelAndView("base") {{
            addObject("title", "Jack Sparrow");
            addObject("loader",
                    (accessToken == null) ? "authenticate" : "index");
        }};
    }

}
