package com.directi.jacksparrow_spring.util;

import com.directi.jacksparrow_spring.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserToMapConverter {

    public Map<?,?> convert(final User user) {
        if (user == null) {
            return new HashMap<String, Object>();
        }
        return new HashMap<String, Object>() {{
            put("user", new HashMap<String, Object>() {{
                put("id", user.getId());
            }});
        }};
    }

}
