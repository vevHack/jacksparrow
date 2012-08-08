package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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
        }};

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) VALUES(?,?)",
                user.getId(), post.getId());

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) " +
                "SELECT follower as \"user\", ? as post FROM follows " +
                "WHERE following=? AND end_on IS NULL",
                post.getId(), user.getId());

        /* XXX NOTIFY the NOTIFY SERVER */
/*
        List<Integer> followersIds = jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE following=? " +
                        "AND end_on IS NULL",
                Integer.class, user.getId());
                */

        return post;
    }
}
