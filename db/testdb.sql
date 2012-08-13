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

SELECT pg_catalog.setval('unique_sequence', 8, true);


--
-- Data for Name: feed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY feed ("user", post, added_on) FROM stdin;
5	8	2012-08-04 17:28:20.73+00
\.


--
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY follows (follower, following, start_on, end_on) FROM stdin;
5	6	2012-07-26 19:07:18.938+00	\N
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY post (id, "user", created_on, content) FROM stdin;
8	5	2012-08-04 17:26:44.472+00	pirates do tweet
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "user" (id, email, username, password, name, access_token, created_on) FROM stdin;
6	foo2@bar.com	foo2	test	\N	6	2012-07-26 19:06:18.938+00
5	foo@bar.com	foo	test	\N	4b524fb1-a326-4240-bed4-6a1169ee2a63	2012-07-25 14:54:30.119+00
\.


--
-- Data for Name: stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY stats ("user", posts, followers, following) FROM stdin;
5	1	0	0
6	0	0	0
\.


--
-- PostgreSQL database dump complete
--

