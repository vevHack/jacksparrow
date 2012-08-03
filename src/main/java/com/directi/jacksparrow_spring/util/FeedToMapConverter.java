package com.directi.jacksparrow_spring.util;

import com.directi.jacksparrow_spring.model.Feed;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FeedToMapConverter {

    public Map<String,Object> convert(final Feed feed) {
        return new HashMap<String, Object>() {{
            put("user", feed.getUserId());
            put("post", feed.getPost());
            put("content", feed.getContent());
            put("added_on", feed.getTimestamp());
        }};
    }

}

