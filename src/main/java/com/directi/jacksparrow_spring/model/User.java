package com.directi.jacksparrow_spring.model;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class User {

        private String email, username, password, name ;
        private int id;

        public static final RowMapper<User> rowMapper = new RowMapper<User>() {
            @Override public User mapRow(ResultSet resultSet, int i) throws SQLException {
                return new User(resultSet);
            }
        };

        public User(ResultSet rs) throws SQLException {
            id = rs.getInt("id");
            email = rs.getString("email");
            username = rs.getString("username");
            password = rs.getString("password");
            name = rs.getString("name");

        }

        public User() { }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
