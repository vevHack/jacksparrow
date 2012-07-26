package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class ApiException extends Exception {

    private final HttpStatus httpStatus;
    private final String message;

    public ApiException(final HttpStatus httpStatus, final String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

}
