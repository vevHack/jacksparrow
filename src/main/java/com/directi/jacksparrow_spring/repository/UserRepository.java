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
import java.util.Map;

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


    public User getUserFromCredentials(final int id, String password)
            throws UserAuthorizationException {

        Map<String, Object> result;
        try {
            result = jdbcTemplate.queryForMap(
                    "SELECT password FROM \"user\" WHERE id=?", id);
        } catch (DataAccessException ex) {
            throw new UserAuthorizationException("User does not exist");
        }
        if (!result.get("password").equals(password)) {
            throw new UserAuthorizationException("Incorrect password");
        }

        return new User() {{
            setId(id);
        }};
    }

    public User verifyUserWithCredentials(User user, String password)
            throws UserAuthorizationException {
        String dbPassword;
        try {
            dbPassword = (String)jdbcTemplate.queryForObject(
                    "SELECT password FROM \"user\" WHERE id=?",
                    String.class, user.getId());
        } catch (DataAccessException ex) {
            throw new UserAuthorizationException("User does not exist");
        }

        if (!dbPassword.equals(password)) {
            throw new UserAuthorizationException("Incorrect password");
        }
        return user;
    }

    public void addUser(User user) {
        jdbcTemplate.update(
                "INSERT INTO \"user\" (username, email, password) " +
                "VALUES (?, ?, ?)",
                user.getUsername(), user.getEmail(), user.getPassword());
        user.setId(jdbcTemplate.queryForInt("SELECT LASTVAL()"));
    }

    public List<Post> postsOf(User user) {
        return jdbcTemplate.query("SELECT id, user, content, created_on " +
                "FROM post WHERE \"user\"=?", new PostMapper(), user.getId());
    }


    public List<User> getFollowers(User user) {
        return jdbcTemplate.query(
                "SELECT follower as id FROM follows WHERE following=?",
                new UserIdMapper(), user.getId());
    }

    public List<User> getFollowing(User user) {
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

    public boolean existsUserWithUsername(String username) {
        return jdbcTemplate.queryForInt(
                "SELECT COUNT(*) FROM \"user\" WHERE username=?",
                username) != 0;
    }

    public boolean existsUserWithId(int id) {
        return jdbcTemplate.queryForInt(
                "SELECT COUNT(*) FROM \"user\" WHERE id=?",
                id) != 0;
    }

    public boolean existsUserWithEmail(String email) {
        return jdbcTemplate.queryForInt(
                "SELECT COUNT(*) FROM \"user\" WHERE email=?",
                email) != 0;
    }

    public boolean isFollowing(User follower, User followee) {
        return jdbcTemplate.queryForInt("SELECT COUNT(*) FROM follows" +
                " WHERE follower=? AND followee=?",
                follower.getId(), followee.getId())!=0;

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


    public User getUserHavingId(int user) {
        final List<Map<String, Object>> ids = jdbcTemplate.queryForList(
                "SELECT username FROM \"user\" WHERE id=?", user);
        return ids.isEmpty() ? null : new User() {{
            setUsername((String)ids.get(0).get("username"));
        }};
    }


    /* XXX does this make existsUserWithUsername redundant */
    public User getUserHavingUsername(String username) {
        final List<Map<String, Object>> ids = jdbcTemplate.queryForList(
                "SELECT id FROM \"user\" WHERE username=?", username);
        return ids.isEmpty() ? null : new User() {{
            setId((Integer)ids.get(0).get("id"));
        }};
    }

    /* XXX does this make existsUserWithEmail redundant */
    public User getUserHavingEmail(String email) {
        final List<Map<String, Object>> ids = jdbcTemplate.queryForList(
                "SELECT id FROM \"user\" WHERE email=?", email);
        return ids.isEmpty() ? null : new User() {{
            setId((Integer)ids.get(0).get("id"));
        }};
    }


    private boolean doesFollow(User follower, User following) {
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

}
