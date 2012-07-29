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
    added_on timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone
);


ALTER TABLE public.feed OWNER TO postgres;

--
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE follows (
    follower integer NOT NULL,
    followee integer NOT NULL,
    start_on timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    end_on timestamp without time zone
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
-- Name: unique_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('unique_sequence', 5, true);


--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE post (
    id integer DEFAULT nextval('unique_sequence'::regclass) NOT NULL,
    "user" integer NOT NULL,
    created_on timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone,
    content text
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE "user" (
    id integer DEFAULT nextval('unique_sequence'::regclass) NOT NULL,
    email character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password text,
    name text,
    created_on timestamp without time zone DEFAULT ('now'::text)::timestamp without time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: feed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY feed ("user", post, added_on) FROM stdin;
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY follows (follower, followee, start_on, end_on) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY post (id, "user", created_on, content) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "user" (id, email, username, password, name, created_on) FROM stdin;
5	foo@bar.com	foo	test	\N	2012-07-25 20:24:30.119612
6   foo2@bar.com    foo2    test    \N  2012-07-27 00:36:18.938863
\.


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
-- Name: feed_user_index; Type: INDEX; Schema: public; Owner: postgres; Tablespace: 
--

CREATE INDEX feed_user_index ON feed USING btree ("user");


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

