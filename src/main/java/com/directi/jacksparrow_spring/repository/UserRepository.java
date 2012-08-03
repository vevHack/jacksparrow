package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Feed;
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

    public List<Map<String, Object>>getUsers() {
        return jdbcTemplate.queryForList("SELECT id FROM \"user\"");
    }


    public List<Map<String, Object>>getPosts(User user) {
        return jdbcTemplate.queryForList(
                "SELECT id, content FROM post WHERE \"user\"=?", user.getId());
    }


    public List<User> getFollowers(User user) {
        return jdbcTemplate.query(
                "SELECT follower as id FROM follows WHERE followee=?",
                new UserIdMapper(), user.getId());
    }

    public List<User> getFollowing(User user) {
        return jdbcTemplate.query(
                "SELECT followee as id FROM follows WHERE follower=?",
                new UserIdMapper(), user.getId());
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

    public List<Feed> getFeed(User user) {

        List<Feed> feeds = this.jdbcTemplate.query(
                "SELECT post, post.user \"user\", content, added_on FROM" +
                        " post, feed WHERE" +
                        " feed.user=? AND post.id=feed.post",

                new RowMapper<Feed>() {
                    public Feed mapRow(ResultSet resultSet, int row)
                        throws SQLException {
                        Feed feed = new Feed();
                        feed.setUserId(resultSet.getInt("user"));
                        feed.setContent(resultSet.getString("content"));
                        feed.setPost(resultSet.getInt("post"));
                        feed.setTimestamp(resultSet.getTimestamp("added_on"));
                        return feed;
                    }

                }, user.getId());

        return feeds;
    }

    public void updateFollow(User follower, User followee) {
        jdbcTemplate.update("INSERT INTO follows" +
                "(follower, followee) VALUES(?,?)",
                follower.getId(), followee.getId()) ;
    }

    public void updateUnfollow(User follower, User followee) {
        jdbcTemplate.update(
                "UPDATE follows SET end_on=LOCALTIMESTAMP WHERE " +
                        "follower=? AND followee=? AND end_on IS NULL",
                follower.getId(), followee.getId());
    }

}
