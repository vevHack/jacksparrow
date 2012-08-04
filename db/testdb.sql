--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Name: unique_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('unique_sequence', 7, true);


--
-- Data for Name: feed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY feed ("user", post, added_on) FROM stdin;
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY follows (follower, following, start_on, end_on) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY post (id, "user", created_on, content) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "user" (id, email, username, password, name, access_token, created_on) FROM stdin;
6	foo2@bar.com	foo2	test	\N	6	2012-07-27 00:36:18.938863
5	foo@bar.com	foo	test	\N	4b524fb1-a326-4240-bed4-6a1169ee2a63	2012-07-25 20:24:30.119612
\.


--
-- PostgreSQL database dump complete
--

