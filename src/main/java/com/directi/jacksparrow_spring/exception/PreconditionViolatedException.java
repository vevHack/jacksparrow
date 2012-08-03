package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class PreconditionViolatedException extends JacksparrowException {
    public PreconditionViolatedException(String message) {
        super(HttpStatus.PRECONDITION_FAILED, message);
    }
}
