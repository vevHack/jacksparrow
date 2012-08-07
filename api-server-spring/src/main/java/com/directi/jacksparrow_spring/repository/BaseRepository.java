package com.directi.jacksparrow_spring.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public class BaseRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

    public String getVersion() {
        return (String)jdbcTemplate.queryForObject("SELECT VERSION()",
                String.class);
    }

    public Timestamp getCurrentTimestamp() {
        return (Timestamp)jdbcTemplate.queryForObject(
                "SELECT CURRENT_TIMESTAMP(3) AT TIME ZONE 'UTC'",
                Timestamp.class);
    }

}
