package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Session;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SessionRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

    private String UUID() {
        return java.util.UUID.randomUUID().toString();
    }

    public Session createNewSessionForUser(final User user) {
        final String uuid = UUID();
        jdbcTemplate.update("INSERT INTO session (\"user\", access_token) " +
                "VALUES (?, ?)", user.getId(), uuid);
        return new Session() {{
            setAccessToken(uuid);
            setUser(user);
        }};
    }


    public void invalidateAccessToken(final String accessToken) {
        jdbcTemplate.update("DELETE FROM session WHERE access_token=?",
                accessToken);
    }

    public User getUserFromAccessToken(final String accessToken)
            throws UserAuthorizationException {
        try {
            return new User() {{
                setId(jdbcTemplate.queryForInt(
                        "SELECT \"user\" FROM session WHERE access_token = ?",
                        accessToken));
            }};
        } catch (DataAccessException ex) {
            throw new UserAuthorizationException("Invalid API Access Token");
        }
    }

}

