# mcps-web

MCP servers — web (6): fetch, searxng, tinyfish, web-reader, web-search-prime, …. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.

| Server | Description | Env keys |
|---|---|---|
| fetch | Web content fetching and data extraction capabilities. Access external APIs, scrape web content, and integrate external data sources. |  |
| searxng | MCP Server for SearXNG, a privacy-respecting metasearch engine. Perform web searches across multiple search engines without tracking. | SEARXNG_URL |
| tinyfish | TinyFish Web Agent - Web browsing and data extraction via MCP with real-time progress streaming, async tasks, and stealth browser profiles. Requires a TinyFish account (tinyfish.ai) with active subscription. Uses OAuth 2.1 authentication. |  |
| web-reader | Web Reader MCP Server - Z.AI implementation based on the Model Context Protocol (MCP). Provides Claude Code, Cline, and other MCP-compatible clients with powerful web content extraction capabilities, including full-page content retrieval and structured data e… |  |
| web-search-prime | Web Search MCP Server - Z.AI search capability implementation based on the Model Context Protocol (MCP), providing powerful Z.AI search capabilities for MCP-compatible clients such as Claude Code and Cline, including web search, real-time information retrieva… |  |
| zread | Zread MCP Server - Z.AI implementation based on the Model Context Protocol (MCP). Powered by zread.ai, it provides Claude Code, Cline, and other MCP-compatible clients with knowledge documentation and code access capabilities for open source repositories. |  |
