package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PostRepository {

    private @Autowired JdbcTemplate jdbcTemplate;

    public Post create(User user, String content) {
        /*XXX
        jdbcTemplate.update("" +
                "INSERT INTO post(\"user\", content) VALUES(?,?)",
                post.getUser(), post.getContent());

        int post_id=jdbcTemplate.queryForInt("SELECT LASTVAL()");

        List<Map<String, Object>> followers = jdbcTemplate.queryForList("" +
                "SELECT follower FROM follows WHERE followee=?",
                post.getUser());

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) VALUES(?,?)",
                post.getUser(), post_id);

        for(Map<String, Object> follower : followers)
            jdbcTemplate.update(
                    "INSERT INTO feed(\"user\", post) VALUES(?,?)",
                    follower.get("follower"), post_id);
                    */
        return new Post() {{}};
    }
}
