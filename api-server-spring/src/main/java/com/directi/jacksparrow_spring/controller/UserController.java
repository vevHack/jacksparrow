package com.directi.jacksparrow_spring.controller;

import com.directi.jacksparrow_spring.exception.EntityNotFoundException;
import com.directi.jacksparrow_spring.exception.PreconditionViolatedException;
import com.directi.jacksparrow_spring.exception.UserAuthorizationException;
import com.directi.jacksparrow_spring.model.Post;
import com.directi.jacksparrow_spring.model.User;
import com.directi.jacksparrow_spring.repository.BaseRepository;
import com.directi.jacksparrow_spring.repository.PostRepository;
import com.directi.jacksparrow_spring.repository.UserRepository;
import com.directi.jacksparrow_spring.service.Authorizer;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/user/")
@SuppressWarnings("unchecked")
public class UserController {

    private @Autowired Authorizer authorizer;
    private @Autowired UserRepository userRepository;
    private @Autowired PostRepository postRepository;
    private @Autowired BaseRepository baseRepository;


    @RequestMapping("/followers")
    @ResponseBody
    public Map followers(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("followers", userRepository.followers(
                    userRepository.findById(user)));
        }};
    }

    @RequestMapping("/following")
    @ResponseBody
    public Map following(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("following", userRepository.following(
                    userRepository.findById(user)));
        }};
    }


    @RequestMapping(value = "/follow", method = RequestMethod.POST)
    @ResponseBody
    public void follow(@RequestParam final int user)
            throws UserAuthorizationException, EntityNotFoundException,
            PreconditionViolatedException {
        userRepository.addFollower(
                authorizer.getAuthorizedUser(), userRepository.findById(user));
    }

    @RequestMapping(value = "/unfollow", method = RequestMethod.POST)
    @ResponseBody
    public void unfollow(@RequestParam final int user)
            throws UserAuthorizationException, EntityNotFoundException,
            PreconditionViolatedException {
        userRepository.removeFollower(
                authorizer.getAuthorizedUser(), userRepository.findById(user));
    }


    private static interface PostFetcher {
        abstract public PostRepository.PostContainer fetch(
                User user, Timestamp now, Timestamp olderThan, Timestamp newerThan)
                throws EntityNotFoundException;
    }

    private Timestamp argOrNull(DateTime arg) {
        return arg == null ? null : new Timestamp(arg.getMillis());
    }

    private Map genericPostListFetcher(
            DateTime olderThan, DateTime newerThan,
            final String label, User user, PostFetcher postFetcher)
            throws PreconditionViolatedException {

        if (olderThan != null && newerThan != null) {
            throw new PreconditionViolatedException(
                    "Cannot filter on both olderThan and newerThan timestamps");
        }

        final Timestamp now = baseRepository.getCurrentTimestamp();
        try {
            final PostRepository.PostContainer postContainer =
                    postFetcher.fetch(user, now,
                            argOrNull(olderThan), argOrNull(newerThan));
            return new HashMap() {{
                put("now", now);
                put("newest", postContainer.newest);
                put("oldest", postContainer.oldest);
                put(label, postContainer.posts);
            }};

        } catch (EntityNotFoundException ex) {
            return new HashMap() {{
                put("now", now);
                put(label, new ArrayList<Post>());
            }};
        }

    }

    /* Older --> NewerThan -->  Included Posts --> OlderThan --> Newer
     *
     * The specified end of the Included Posts interval is open, while the
     * other end is closed.
     */
    @RequestMapping("/feed")
    @ResponseBody
    public Map feed(
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime olderThan,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime newerThan)
            throws UserAuthorizationException, PreconditionViolatedException {

        return genericPostListFetcher(olderThan, newerThan, "feed",
                authorizer.getAuthorizedUser(), new PostFetcher() {
            @Override
            public PostRepository.PostContainer fetch(
                    User user, Timestamp now,
                    Timestamp olderThan, Timestamp newerThan)
                    throws EntityNotFoundException {
                return postRepository.feedOf(user, now, olderThan, newerThan);
            }
        });

    }

    @RequestMapping("/posts")
    @ResponseBody
    public Map posts(
            @RequestParam final int user,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime olderThan,
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            @RequestParam(required = false) DateTime newerThan)
            throws EntityNotFoundException, PreconditionViolatedException {

        return genericPostListFetcher(olderThan, newerThan, "posts",
                userRepository.findById(user), new PostFetcher() {
            @Override
            public PostRepository.PostContainer fetch(
                    User user, Timestamp now,
                    Timestamp olderThan, Timestamp newerThan)
                    throws EntityNotFoundException {
                return postRepository.postsOf(user, now, olderThan, newerThan);
            }
        });

    }



    @RequestMapping("/find")
    @ResponseBody
    public Map findUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email) {
        User user = null;

        try {
            if (username != null && email != null) {
                user = userRepository.findByUsername(username);
                if (user.getId()
                        != userRepository.findByEmail(email).getId()) {
                    user = null;
                }
            } else if (username == null) {
                user = userRepository.findByEmail(email);
            } else if (email == null) {
                user = userRepository.findByUsername(username);
            }
        }catch (EntityNotFoundException ex) {
            user = null;
        }

        Map map = new HashMap();
        if (user != null) {
            map.put("user", user);
        }
        return map;
    }

    @RequestMapping("/details")
    @ResponseBody
    public Map details(@RequestParam("user") final List<Integer> users,
                       @RequestParam("field") final List<String> fields)
        throws PreconditionViolatedException {
        return new HashMap() {{
            put("users", userRepository.details(users, fields));
        }};
    }


    @RequestMapping("/stats")
    @ResponseBody
    public Map stats(@RequestParam final int user)
        throws EntityNotFoundException {
        return new HashMap() {{
            put("stats", userRepository.stats(userRepository.findById(user)));
        }};
    }

}
