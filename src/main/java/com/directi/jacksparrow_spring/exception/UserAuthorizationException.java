package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class UserAuthorizationException extends JacksparrowException {
    public UserAuthorizationException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
