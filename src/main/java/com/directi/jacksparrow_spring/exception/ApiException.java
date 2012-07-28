package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

/* XXX DELETE ME */
public class ApiException extends JacksparrowException {
    public ApiException(HttpStatus httpStatus, String message) {
        super(httpStatus, message);
    }
}
