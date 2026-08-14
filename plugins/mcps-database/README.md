# mcps-database

MCP servers — database (8): dbhub, mongodb-official, mysql, Neon, postgres-documentation, …. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.

| Server | Description | Env keys |
|---|---|---|
| dbhub | Zero-dependency, token-efficient database MCP server supporting PostgreSQL, MySQL, MariaDB, SQL Server, and SQLite connections. | DATABASE_DSN |
| mongodb-official | Official MongoDB MCP Server by MongoDB. Connect to MongoDB databases and Atlas clusters for querying, aggregation, and collection management. | MDB_MCP_CONNECTION_STRING |
| mysql | Connect to MySQL databases for direct data access, queries, and database management within Claude Code workflows. | MYSQL_CONNECTION_STRING |
| Neon | MCP server for interacting with Neon Management API and databases |  |
| postgres-documentation | PostgreSQL documentation and skills for writing better Postgres code |  |
| postgresql | Connect to PostgreSQL databases for advanced data operations, complex queries, and enterprise database management. | POSTGRES_CONNECTION_STRING |
| redis | Official Redis MCP Server providing natural language interface for Redis databases. Query, manage, and interact with Redis data through Claude. | REDIS_URL |
| supabase | Connect your Claude Code to Supabase using MCP | SUPABASE_ACCESS_TOKEN |
