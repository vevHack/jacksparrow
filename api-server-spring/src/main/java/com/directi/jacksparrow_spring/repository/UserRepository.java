package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.GenericRowMapper;
import com.directi.jacksparrow_spring.model.IdRowMapper;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class UserRepository {

    private @Autowired JdbcTemplate jdbcTemplate;
    private @Autowired NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private static final RowMapper<User> userIdMapper
            = new IdRowMapper<User>(User.class);

    private static final Map<?, ?> allowedBindings =
            new HashMap<String, String> () {{
                put("username", "username");
                put("email", "email");
                put("name", "name");
            }};


    public User verifyCredentials(User user, String password)
            throws UserAuthorizationException, EntityNotFoundException {
        String dbPassword;
        try {
            dbPassword = (String)jdbcTemplate.queryForObject(
                    "SELECT password FROM \"user\" WHERE id=?",
                    String.class, user.getId());
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }

        if (!dbPassword.equals(password)) {
            throw new UserAuthorizationException("Incorrect password");
        }
        return user;
    }


    public List<User> followers(User user) {
        return jdbcTemplate.query(
                "SELECT follower as id FROM follows WHERE following=? " +
                        "AND end_on IS NULL",
                userIdMapper, user.getId());
    }

    public List<User> following(User user) {
        return jdbcTemplate.query(
                "SELECT following as id FROM follows WHERE follower=?" +
                        "AND end_on IS NULL",
                userIdMapper, user.getId());
    }


    public User findById(int id) throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE id=?", userIdMapper, id);
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }
    }

    public User findByUsername(String username)
            throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE username=?",
                    userIdMapper, username);
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }
    }

    public User findByEmail(String email)
            throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE email=?",
                    userIdMapper, email);
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }
    }


    public boolean doesFollow(User follower, User following) {
        int c = jdbcTemplate.queryForInt("SELECT COUNT(*) FROM follows WHERE " +
                "follower=? AND following=? AND end_on IS NULL",
                follower.getId(), following.getId());
        if (c > 1) {
            throw new RuntimeException("Follows table is inconsistent");
        }
        return (c == 1);
    }

    public void addFollower(User follower, User following)
        throws PreconditionViolatedException {
        if (follower.getId() == following.getId()) {
            throw new PreconditionViolatedException("User cannot follow own-self");
        }
        if (doesFollow(follower, following)) {
            throw new PreconditionViolatedException("Already following user");
        }
        jdbcTemplate.update("INSERT INTO follows (follower, following) " +
                "VALUES(?,?)", follower.getId(), following.getId());
    }

    public void removeFollower(User follower, User following)
        throws PreconditionViolatedException {
        if (!doesFollow(follower, following)) {
            throw new PreconditionViolatedException("Not following user");
        }
        jdbcTemplate.update("UPDATE follows SET " +
                "end_on=CURRENT_TIMESTAMP(3) WHERE " +
                "follower=? AND following=? AND end_on IS NULL",
                follower.getId(), following.getId());
    }


    public User addUser(String username, String email, String password) {
        jdbcTemplate.update("INSERT INTO \"user\" (username, email, password) " +
                "VALUES (?, ?, ?)", username, email, password);
        return new User() {{
            setId(jdbcTemplate.queryForInt("SELECT LASTVAL()"));
        }};
    }


    public List<User> details(final List<Integer> users, List<String> fields)
            throws PreconditionViolatedException {

        Map<String, String> bindings = new HashMap<String, String>() {{
            put("id", "id");
        }};
        for (String field: fields) {
            String modelField = (String)allowedBindings.get(field);
            if (modelField == null) {
                throw new PreconditionViolatedException("Invalid detail " + field);
            }
            bindings.put(field, modelField);
        }

        GenericRowMapper<User> mapper =
                new GenericRowMapper<User>(User.class, bindings);
        return namedParameterJdbcTemplate.query(
                "SELECT * FROM \"user\" WHERE id in (:ids)",
                new MapSqlParameterSource("ids", users), mapper);
    }
}
