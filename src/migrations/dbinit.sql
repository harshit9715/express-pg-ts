CREATE TABLE trader.todos
(
    id integer NOT NULL,
    title text  NOT NULL,
    description text NOT NULL,
    "isFinished" boolean NOT NULL,
    CONSTRAINT todos_pkey PRIMARY KEY (id)
)
