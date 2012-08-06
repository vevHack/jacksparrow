package com.directi.jacksparrow_spring.exception;

import org.springframework.http.HttpStatus;

public class EntityNotFoundException extends JacksparrowException {
    public EntityNotFoundException(String entity) {
        super(HttpStatus.PRECONDITION_FAILED, entity + " not found");
    }
}
