package com.directi.jacksparrow_spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Service
public class Queries {

    private JdbcTemplate jdbcTemplate;

    @Autowired
    public Queries(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> queryFollowers (int user) {
        return jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE followee=?", user);
    }

    public List<Map<String, Object>> queryFollowing (int user) {
        return jdbcTemplate.queryForList(
                "SELECT followee FROM follows WHERE follower=?", user);
    }

    public List<Map<String, Object>> queryUsers() {
        return jdbcTemplate.queryForList("SELECT id FROM \"user\"");
    }

    public List<Map<String, Object>> queryPosts(int user) {
        return jdbcTemplate.queryForList(
                "SELECT id, content FROM post WHERE \"user\"=?", user);
    }

    public void updateUnfollow (int follower, int followee) {
        jdbcTemplate.update(
            "UPDATE follows SET end_on=LOCALTIMESTAMP WHERE follower=? AND followee=? AND end_on IS NULL",
                follower, followee);
    }

    public void createPost (int user, String content) {
        jdbcTemplate.update("INSERT INTO post(\"user\", content) VALUES(?,?)", user, content);
    }

    public void updateFollow (int follower, int followee) {
        jdbcTemplate.update("INSERT INTO follows(follower, followee) VALUES(?,?)", follower, followee) ;
    }

    public List<Map<String, Object>> queryFeed (int user) {
       return jdbcTemplate.queryForList(
                "SELECT post FROM feed WHERE \"user\"=?", user);
    }
}
