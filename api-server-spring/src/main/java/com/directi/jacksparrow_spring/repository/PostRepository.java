package com.directi.jacksparrow_spring.repository;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class PostRepository {

    private static final int POSTS_PER_QUERY = 10;

    private @Autowired JdbcTemplate jdbcTemplate;
    private @Autowired NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public static class PostMapper implements RowMapper<Post> {
        @Override
        public Post mapRow(final ResultSet rs, int rowNum) throws SQLException {
            return new Post() {{
                setId(rs.getInt("id"));
                setUser(new User() {{
                    setId(rs.getInt("user"));
                }});
                setContent(rs.getString("content"));
                setCreatedOn(rs.getTimestamp("created_on"));
            }};
        }
    }



    public static class PostContainer {
        public List<Post> posts;
        public Timestamp start, end;

        public PostContainer(List<Post> posts,
                             MapSqlParameterSource parameterSource) {
            this.posts = posts;
            start = (Timestamp)parameterSource.getValue("start");
            end = (Timestamp)parameterSource.getValue("end");
        }
    };

    private MapSqlParameterSource defaultTimestampParameters(final User user) {
        return new MapSqlParameterSource() {{
            addValue("user", user.getId());
            addValue("tsCount", POSTS_PER_QUERY);
        }};
    }

    private MapSqlParameterSource subsequentParameters(
            String query, User user, Timestamp end) {
        MapSqlParameterSource parameterSource = defaultTimestampParameters(user);
        parameterSource.addValue("end", end);
        parameterSource.addValue("start",
                namedParameterJdbcTemplate.queryForObject(query,
                        parameterSource, Timestamp.class));
        return parameterSource;
    }

    private MapSqlParameterSource previousParameters(
            String query, User user, Timestamp start) {
        MapSqlParameterSource parameterSource = defaultTimestampParameters(user);
        parameterSource.addValue("start", start);
        parameterSource.addValue("end",
                namedParameterJdbcTemplate.queryForObject(
                        query, parameterSource, Timestamp.class));
        return parameterSource;
    }

    private PostContainer postContainerFor(
            User user, Timestamp now ,Timestamp start, Timestamp end,
            String subsequentTimestampsQuery, String previousTimestampsQuery,
            String dataQuery)
            throws EntityNotFoundException {
        MapSqlParameterSource parameterSource;
        try {
            if (end != null) {
                parameterSource = subsequentParameters(
                        subsequentTimestampsQuery, user, end);
            } else {
                parameterSource = previousParameters(
                        previousTimestampsQuery, user,
                        start == null ? now : start);
            }
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("Post");
        }

        List<Post> posts = namedParameterJdbcTemplate.query(
                dataQuery, parameterSource, new PostMapper());
        return new PostContainer(posts, parameterSource);
    }


    private static final String subsequentFeedTimestampsQuery =
            "SELECT added_on FROM (" +
                    "SELECT added_on FROM feed WHERE \"user\"=(:user) " +
                    "AND added_on > (:end) " +
                    "ORDER BY added_on ASC LIMIT (:tsCount) " +
                    ") as added_on ORDER BY added_on DESC LIMIT 1";

    private static final String previousFeedTimestampsQuery =
            "SELECT added_on FROM (" +
                    "SELECT added_on FROM feed WHERE \"user\"=(:user) " +
                    "AND added_on < (:start) " +
                    "ORDER BY added_on DESC LIMIT (:tsCount) " +
                    ") as added_on ORDER BY added_on ASC LIMIT 1";

    private static final String feedQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE id in (" +
                    "SELECT post as id FROM feed " +
                    "WHERE \"user\"=(:user) " +
                    "AND added_on < (:start) AND added_on >= (:end)" +
                    ") ORDER BY created_on DESC";

    public PostContainer feedOf(
            User user, Timestamp now ,Timestamp start, Timestamp end)
            throws EntityNotFoundException {
        return postContainerFor(user, now, start, end,
                subsequentFeedTimestampsQuery, previousFeedTimestampsQuery,
                feedQuery);
    }


    private static final String subsequentPostsTimestampsQuery =
            "SELECT created_on FROM (" +
                    "SELECT created_on FROM feed WHERE \"user\"=(:user) " +
                    "AND created_on > (:end) " +
                    "ORDER BY created_on ASC LIMIT (:tsCount) " +
                    ") as created_on ORDER BY created_on DESC LIMIT 1";

    private static final String previousPostsTimestampsQuery =
            "SELECT created_on FROM (" +
                    "SELECT created_on FROM post WHERE \"user\"=(:user) " +
                    "AND created_on < (:start) " +
                    "ORDER BY created_on DESC LIMIT (:tsCount) " +
                    ") as created_on ORDER BY created_on ASC LIMIT 1";

    private static final String postsQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE \"user\"=(:user) " +
                    "AND created_on < (:start) AND created_on >= (:end) " +
                    "ORDER BY created_on DESC";

    public PostContainer postsOf(
            User user, Timestamp now ,Timestamp start, Timestamp end)
            throws EntityNotFoundException {
        return postContainerFor(user, now, start, end,
                subsequentPostsTimestampsQuery, previousPostsTimestampsQuery,
                postsQuery);
    }



    public Post create(final User user, final String content) {
        jdbcTemplate.update(
                "INSERT INTO post(\"user\", content) VALUES(?,?)",
                user.getId(), content);

        Post post = new Post() {{
            setId(jdbcTemplate.queryForInt("SELECT LASTVAL()"));
            setUser(user);
        }};

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) VALUES(?,?)",
                user.getId(), post.getId());

        jdbcTemplate.update("INSERT INTO feed(\"user\", post) " +
                "SELECT follower as \"user\", ? as post FROM follows " +
                "WHERE following=? AND end_on IS NULL",
                post.getId(), user.getId());

        /* XXX NOTIFY the NOTIFY SERVER */
/*
        List<Integer> followersIds = jdbcTemplate.queryForList(
                "SELECT follower FROM follows WHERE following=? " +
                        "AND end_on IS NULL",
                Integer.class, user.getId());
                */

        return post;
    }
}
