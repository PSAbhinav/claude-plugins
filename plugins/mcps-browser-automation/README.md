# mcps-browser-automation

MCP servers — browser_automation (6): automatalabs-playwright-server, browser-server, browserbase, browsermcp, executeautomation-playwright-server, …. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.

| Server | Description | Env keys |
|---|---|---|
| automatalabs-playwright-server | A Model Context Protocol server that provides browser automation capabilities using Playwright |  |
| browser-server | An MCP server that enables AI agents to control web browsers using browser-use. | OPENAI_API_KEY |
| browserbase | This server provides cloud browser automation capabilities using Browserbase and Stagehand. It enables LLMs to interact with web pages, take screenshots, extract information, and perform automated actions with atomic precision. | BROWSERBASE_API_KEY, BROWSERBASE_PROJECT_ID, GEMINI_API_KEY |
| browsermcp | With Browser MCP, you can use MCP to automate your browser so that AI applications can navigate the web, fill out forms, and more. |  |
| executeautomation-playwright-server | A Model Context Protocol server that provides browser automation capabilities using Playwright. This server enables LLMs to interact with web pages, take screenshots, generate test code, web scraps the page and execute JavaScript in a real browser environment. |  |
| playwright-server | A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright. This server enables LLMs to interact with web pages through structured accessibility snapshots, bypassing the need for screenshots or visually-tuned models. |  |
