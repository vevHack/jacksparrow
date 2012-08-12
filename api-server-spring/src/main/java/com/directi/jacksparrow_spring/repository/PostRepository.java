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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class PostRepository {

    private static final int POSTS_PER_QUERY = 10;

    private @Autowired FeedUpdater feedUpdater;

    private @Autowired JdbcTemplate jdbcTemplate;
    private @Autowired NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private static class PostMapper implements RowMapper<Post> {
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

    private static final PostMapper postMapper = new PostMapper();



    public static class PostContainer {
        public List<Post> posts;
        public Timestamp oldest, newest;

        public PostContainer(List<Post> posts,
                             MapSqlParameterSource parameterSource) {
            this.posts = posts;
            newest = (Timestamp)parameterSource.getValue("olderThan");
            oldest = (Timestamp)parameterSource.getValue("newerThan");
        }
    };

    private MapSqlParameterSource defaultTimestampParameters(final User user) {
        return new MapSqlParameterSource() {{
            addValue("user", user.getId());
            addValue("tsCount", POSTS_PER_QUERY);
        }};
    }

    private MapSqlParameterSource olderThanParameters(
            String query, User user, Timestamp olderThan) {
        MapSqlParameterSource parameterSource = defaultTimestampParameters(user);
        parameterSource.addValue("olderThan", olderThan);
        parameterSource.addValue("newerThan",
                namedParameterJdbcTemplate.queryForObject(
                        query, parameterSource, Timestamp.class));
        return parameterSource;
    }

    private MapSqlParameterSource newerThanParameters(
            String query, User user, Timestamp newerThan) {
        MapSqlParameterSource parameterSource = defaultTimestampParameters(user);
        parameterSource.addValue("newerThan", newerThan);
        parameterSource.addValue("olderThan",
                namedParameterJdbcTemplate.queryForObject(query,
                        parameterSource, Timestamp.class));
        return parameterSource;
    }

    private PostContainer postContainerFor(
            User user, Timestamp now ,Timestamp olderThan, Timestamp newerThan,
            String olderThanTimestampsQuery, String newerThanTimestampsQuery,
            String olderThanQuery, String newerThanQuery)
            throws EntityNotFoundException {
        MapSqlParameterSource parameterSource;
        String query;
        try {
            if (newerThan != null) {
                parameterSource = newerThanParameters(
                        newerThanTimestampsQuery, user, newerThan);
                query = newerThanQuery;
            } else {
                parameterSource = olderThanParameters(
                        olderThanTimestampsQuery, user,
                        olderThan == null ? now : olderThan);
                query = olderThanQuery;
            }
        } catch (DataAccessException ex) {
            throw new EntityNotFoundException("Post");
        }

        List<Post> posts = namedParameterJdbcTemplate.query(
                query, parameterSource, postMapper);
        return new PostContainer(posts, parameterSource);
    }


    private static final String feedOlderThanTimestampsQuery =
            "SELECT added_on FROM (" +
                    "SELECT added_on FROM feed WHERE \"user\"=(:user) " +
                    "AND added_on < (:olderThan) " +
                    "ORDER BY added_on DESC LIMIT (:tsCount) " +
                    ") as added_on ORDER BY added_on ASC LIMIT 1";

    private static final String feedOlderThanQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE id in (" +
                    "SELECT post as id FROM feed " +
                    "WHERE \"user\"=(:user) " +
                    "AND added_on < (:olderThan) AND added_on >= (:newerThan)" +
                    ") ORDER BY created_on DESC";

    private static final String feedNewerThanTimestampsQuery =
            "SELECT added_on FROM (" +
                    "SELECT added_on FROM feed WHERE \"user\"=(:user) " +
                    "AND added_on > (:newerThan) " +
                    "ORDER BY added_on ASC LIMIT (:tsCount) " +
                    ") as added_on ORDER BY added_on DESC LIMIT 1";

    private static final String feedNewerThanQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE id in (" +
                    "SELECT post as id FROM feed " +
                    "WHERE \"user\"=(:user) " +
                    "AND added_on <= (:olderThan) AND added_on > (:newerThan)" +
                    ") ORDER BY created_on DESC";

    public PostContainer feedOf(
            User user, Timestamp now ,Timestamp olderThan, Timestamp newerThan)
            throws EntityNotFoundException {
        return postContainerFor(user, now, olderThan, newerThan,
                feedOlderThanTimestampsQuery, feedNewerThanTimestampsQuery,
                feedOlderThanQuery, feedNewerThanQuery);
    }


    private static final String postsOlderThanTimestampsQuery =
            "SELECT created_on FROM (" +
                    "SELECT created_on FROM post WHERE \"user\"=(:user) " +
                    "AND created_on < (:olderThan) " +
                    "ORDER BY created_on DESC LIMIT (:tsCount) " +
                    ") as created_on ORDER BY created_on ASC LIMIT 1";

    private static final String postsOlderThanQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE \"user\"=(:user) " +
                    "AND created_on < (:olderThan) AND created_on >= (:newerThan) " +
                    "ORDER BY created_on DESC";

    private static final String postsNewerThanTimestampsQuery =
            "SELECT created_on FROM (" +
                    "SELECT created_on FROM post WHERE \"user\"=(:user) " +
                    "AND created_on > (:newerThan) " +
                    "ORDER BY created_on ASC LIMIT (:tsCount) " +
                    ") as created_on ORDER BY created_on DESC LIMIT 1";

    private static final String postsNewerThanQuery =
            "SELECT id, \"user\", content, created_on FROM post " +
                    "WHERE \"user\"=(:user) " +
                    "AND created_on <= (:olderThan) AND created_on > (:newerThan) " +
                    "ORDER BY created_on DESC";

    public PostContainer postsOf(
            User user, Timestamp now ,Timestamp olderThan, Timestamp newerThan)
            throws EntityNotFoundException {
        return postContainerFor(user, now, olderThan, newerThan,
                postsOlderThanTimestampsQuery, postsNewerThanTimestampsQuery,
                postsOlderThanQuery, postsNewerThanQuery);
    }


    public List<Post> details(final List<Integer> posts) {
        return namedParameterJdbcTemplate.query(
                "SELECT * FROM post WHERE id in (:ids)",
                new MapSqlParameterSource("ids", posts), postMapper);
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

        feedUpdater.add(user, post);

        return post;
    }

    @Component
    public static class FeedUpdater {

        private @Autowired JdbcTemplate jdbcTemplate;

        @Async
        public void add(User user, Post post) {
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
        }

    };
}
