package com.directi.jacksparrow_spring.util;

import java.util.HashMap;
import java.util.Map;

public class Error {

    private int code;
    private final String message;

    public Error(final int code, final String message) {
        this.code = code;
        this.message = message;
    }

    public Map<String, Object> toMap() {
        return new HashMap<String, Object>() {{
            put("error", new HashMap<String, Object>() {{
                put("code", code);
                put("message", message);
            }});
        }};
    }
}
