--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: jacksparrow; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE jacksparrow WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_IN' LC_CTYPE = 'en_IN';


ALTER DATABASE jacksparrow OWNER TO postgres;

\connect jacksparrow

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: feed; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE feed (
    "user" integer NOT NULL,
    post integer NOT NULL,
    added_on timestamp with time zone DEFAULT timezone('UTC'::text, ('now'::text)::timestamp(3) with time zone)
);


ALTER TABLE public.feed OWNER TO postgres;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE follows (
    follower integer NOT NULL,
    following integer NOT NULL,
    start_on timestamp with time zone DEFAULT timezone('UTC'::text, ('now'::text)::timestamp(3) with time zone),
    end_on timestamp with time zone
);


ALTER TABLE public.follows OWNER TO postgres;

--
-- Name: unique_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE unique_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unique_sequence OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE post (
    id integer DEFAULT nextval('unique_sequence'::regclass) NOT NULL,
    "user" integer NOT NULL,
    created_on timestamp with time zone DEFAULT timezone('UTC'::text, ('now'::text)::timestamp(3) with time zone),
    content text
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: stats; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stats (
    "user" integer NOT NULL,
    posts integer DEFAULT 0 NOT NULL,
    followers integer DEFAULT 0 NOT NULL,
    following integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.stats OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id integer DEFAULT nextval('unique_sequence'::regclass) NOT NULL,
    email character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password text,
    name text,
    access_token character varying(40),
    created_on timestamp with time zone DEFAULT timezone('UTC'::text, ('now'::text)::timestamp(3) with time zone)
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: stats_user_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stats
    ADD CONSTRAINT stats_user_key UNIQUE ("user");


--
-- Name: user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_username_key UNIQUE (username);


--
-- Name: feed_added_on_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX feed_added_on_idx ON feed USING btree (added_on);


--
-- Name: feed_user_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX feed_user_index ON feed USING btree ("user");


--
-- Name: follows_follower_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX follows_follower_idx ON follows USING btree (follower);


--
-- Name: follows_following_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX follows_following_idx ON follows USING btree (following);


--
-- Name: post_created_on_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX post_created_on_idx ON post USING btree (created_on);


--
-- Name: stats_user_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX stats_user_idx ON stats USING btree ("user");


--
-- Name: user_access_token_idx; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE UNIQUE INDEX user_access_token_idx ON "user" USING btree (access_token);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

