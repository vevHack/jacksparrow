package com.directi.jacksparrow_spring.model;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Post {

    private int user_id, id;
    private String content;

    public static final RowMapper<Post> rowMapper = new RowMapper<Post>() {
        @Override public Post mapRow(ResultSet resultSet, int i) throws SQLException {
            return new Post(resultSet);
        }
    };


    public Post (ResultSet resultSet) throws SQLException {
        user_id = resultSet.getInt("user_id");
        id = resultSet.getInt("id");
        content = resultSet.getString("content");
    }


    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
