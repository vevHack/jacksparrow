package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PostRepository {

    private @Autowired JdbcTemplate jdbcTemplate;

    public Post create(final User user, final String content) {
        jdbcTemplate.update(
                "INSERT INTO post(\"user\", content) VALUES(?,?)",
                user.getId(), content);

        Post post = new Post() {{
            setId(jdbcTemplate.queryForInt("SELECT LASTVAL()"));
            setUser(user);
            setContent(content);
        }};

        List<Integer> followersIds = jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE following=?",
                Integer.class, user.getId());

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) VALUES(?,?)",
                user.getId(), post.getId());

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) " +
                "SELECT follower as \"user\", ? as post FROM follows" +
                "WHERE following=?", post.getId(), user.getId());

        return post;
    }
}
