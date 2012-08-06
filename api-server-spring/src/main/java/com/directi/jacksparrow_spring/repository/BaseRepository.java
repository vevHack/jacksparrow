package com.directi.jacksparrow_spring.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;

@Repository
public class BaseRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

    public String getVersion() {
        return (String)jdbcTemplate.queryForMap("SELECT VERSION()")
                .get("version");
    }

    public Timestamp getCurrentTimestamp() {
        return (Timestamp)jdbcTemplate.queryForMap("SELECT LOCALTIMESTAMP")
                .get("timestamp");
    }

}
