package com.directi.jacksparrow_spring.util;

import org.springframework.http.HttpStatus;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class ErrorResponse {

    private int status;
    private String msg;
    private HttpServletResponse response;

    public ErrorResponse(HttpStatus status, String msg,
                         HttpServletResponse response) {
        this.status = status.value();
        this.msg = msg;
        this.response = response;
    }

    public Map<String, Object> respond() {
        response.setStatus(status);
        return new Error(status, msg).toMap();
    }
}
