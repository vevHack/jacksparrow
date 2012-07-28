package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.UserValidationException;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class UserRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

    public User getUserFromCredentials(final int id, String password)
            throws UserValidationException {

        Map<String, Object> result;
        try {
            result = jdbcTemplate.queryForMap(
                    "SELECT password FROM \"user\" WHERE id=?", id);
        } catch (DataAccessException ex) {
            throw new UserValidationException("User does not exist");
        }
        if (!result.get("password").equals(password)) {
            throw new UserValidationException("Incorrect password");
        }

        return new User() {{
            setId(id);
        }};
    }

    public void addUser(User user) {

    }
}
