package com.directi.jacksparrow_spring.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpSession;

@Service
public class LoginUtil {
    private @Autowired HttpSession httpSession;
    private final static String USER_KEY = "user";

    public void setLoggedInUserId(int userId) {
        httpSession.setAttribute(USER_KEY, userId);
    }
    public Integer getLoggedInUserId() {
        return (Integer)httpSession.getAttribute(USER_KEY);
    }

    public void logoutLoggedInUser() {
        httpSession.invalidate();
    }
}
