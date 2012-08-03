package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class UserRepository {
    private @Autowired JdbcTemplate jdbcTemplate;

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

    public User generateAccessToken(User user) {
        String accessToken = (String)jdbcTemplate.queryForObject(
                "SELECT access_token FROM \"user\" WHERE id=?",
                String.class, user.getId());

        if (accessToken == null) {
            accessToken = UUID.randomUUID().toString();
            jdbcTemplate.update("UPDATE \"user\" SET access_token = ? WHERE " +
                    "id = ?", accessToken, user.getId());
        }
        user.setAccessToken(accessToken);

        return user;
    }

    public void addUser(User user) {
        jdbcTemplate.update(
                "INSERT INTO \"user\" (username, email, password) " +
                "VALUES (?, ?, ?)",
                user.getUsername(), user.getEmail(), user.getPassword());
        user.setId(jdbcTemplate.queryForInt("SELECT LASTVAL()"));
    }

    public List<Map<String, Object>>getFollowers(User user) {
        return jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE followee=?", user.getId());
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
        return jdbcTemplate.queryForList("SELECT COUNT(*) FROM follows WHERE follower=? AND followee=?",
                follower.getId(), followee.getId()).size()!=0;

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

    public List<Map<String, Object>> getFeed(User user) {
        return jdbcTemplate.queryForList(
                "SELECT post FROM feed WHERE \"user\"=?", user.getId());
    }

    public void updateFollow(User follower, User followee) {
        jdbcTemplate.update("INSERT INTO follows(follower, followee) VALUES(?,?)",
                follower.getId(), followee.getId()) ;
    }

    public void updateUnfollow(User follower, User followee) {
        jdbcTemplate.update(
                "UPDATE follows SET end_on=LOCALTIMESTAMP WHERE follower=? AND followee=? AND end_on IS NULL",
                follower.getId(), followee.getId());
    }

}
