package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends JacksparrowException {
    public ValidationException(String message) {
        super(HttpStatus.PRECONDITION_FAILED, message);
    }
}
