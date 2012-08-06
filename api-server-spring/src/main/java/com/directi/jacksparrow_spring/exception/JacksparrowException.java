package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class JacksparrowException extends Exception {

    private HttpStatus httpStatus;

    public JacksparrowException(HttpStatus httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
