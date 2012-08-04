package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class UserRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

    public static class UserIdMapper implements RowMapper<User> {
        @Override
        public User mapRow(final ResultSet rs, int rowNum) throws SQLException {
            return new User() {{
                setId(rs.getInt("id"));
            }};
        }
    }

    /* XXX */
    public static class PostIdMapper implements RowMapper<Post> {
        @Override
        public Post mapRow(final ResultSet rs, int rowNum) throws SQLException {
            return new Post() {{
                setId(rs.getInt("id"));
            }};
        }
    }

    public static class PostMapper implements RowMapper<Post> {
        @Override
        public Post mapRow(final ResultSet rs, int rowNum) throws SQLException {
            return new Post() {{
                setId(rs.getInt("id"));
                setUser(rs.getInt("user"));
                setContent(rs.getString("content"));
                setCreatedOn(rs.getTimestamp("created_on"));
            }};
        }
    }


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
                "SELECT follower as id FROM follows WHERE following=?",
                new UserIdMapper(), user.getId());
    }

    public List<User> following(User user) {
        return jdbcTemplate.query(
                "SELECT following as id FROM follows WHERE follower=?",
                new UserIdMapper(), user.getId());
    }

    public List<Post> feedOf(User user) {
        return jdbcTemplate.query(
                "SELECT id, user, content, created_on FROM post where " +
                        "id in (SELECT post FROM feed WHERE \"user\"=?)",
                new PostMapper(), user.getId());
    }

    public List<Post> postsOf(User user) {
        return jdbcTemplate.query("SELECT id, user, content, created_on " +
                "FROM post WHERE \"user\"=?", new PostMapper(), user.getId());
    }


    public User findById(int id) throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE id=?",
                    new UserIdMapper(), id);
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }
    }

    public User findByUsername(String username)
            throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE username=?",
                    new UserIdMapper(), username);
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("User");
        }
    }

    public User findByEmail(String email)
            throws EntityNotFoundException {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM \"user\" WHERE email=?",
                    new UserIdMapper(), email);
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
        jdbcTemplate.update("UPDATE follows SET end_on=LOCALTIMESTAMP WHERE " +
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
}
