# mcps-devtools

MCP servers — devtools (45): @microsoft/clarity-mcp-server, aks, android-mcp, bitbucket, chrome-devtools, …. NOTE: enabling starts ALL servers in this pack; most need API keys/env config first.

| Server | Description | Env keys |
|---|---|---|
| @microsoft/clarity-mcp-server |  |  |
| aks | The AKS-MCP is a Model Context Protocol (MCP) server that enables AI assistants to interact with Azure Kubernetes Service (AKS) clusters. It serves as a bridge between AI tools (like GitHub Copilot, Claude, and other MCP-compatible AI assistants) and AKS, tra… |  |
| android-mcp | MCP Server for interacting with Android devices. Control, inspect, and automate Android devices via ADB through Claude. |  |
| bitbucket | A Node.js/TypeScript Model Context Protocol (MCP) server for Atlassian Bitbucket Cloud. Enables AI systems (e.g., LLMs like Claude or Cursor AI) to securely interact with your repositories, pull requests, workspaces, and code in real time. |  |
| chrome-devtools | A Model Context Protocol server for interacting with Chrome DevTools, enabling browser automation, debugging, and performance analysis capabilities. |  |
| circleci-mcp-server | Integrate CircleCI build and deployment pipeline management with your Claude Code workflow. Monitor builds, trigger deployments, and access project insights. | CIRCLECI_TOKEN, CIRCLECI_BASE_URL |
| codacy | MCP Server for the Codacy API, enabling access to repositories, files, quality, coverage, security and more. | CODACY_ACCOUNT_TOKEN |
| context7 | Context7 by Upstash pulls up-to-date, version-specific documentation and code examples straight from the source and injects them into your prompt. Add 'use context7' to any prompt to activate. | CONTEXT7_API_KEY |
| DevBox | This server enables natural language interactions for developer-focused operations like managing Dev Boxes, configurations, and pools. |  |
| devplan |  |  |
| dynatrace-mcp-server | Manage and interact with the Dynatrace Platform for real-time observability and monitoring. | DT_PLATFORM_TOKEN, DT_ENVIRONMENT |
| elasticsearch-mcp-server | MCP server for connecting to Elasticsearch data and indices. Supports search queries, mappings, ES\|QL, and shard information through natural language interactions. | ES_URL, ES_API_KEY |
| Figma Dev Mode MCP | The Dev Mode MCP server brings Figma directly into your workflow by providing important design information and context to AI agents generating code from Figma design files. |  |
| firecrawl-mcp | A Model Context Protocol (MCP) server implementation that integrates with Firecrawl for web scraping capabilities. | FIRECRAWL_API_KEY |
| firefly | Connect to Firefly AI services for advanced AI-powered development assistance, code analysis, and intelligent suggestions directly in your Claude Code environment. | FIREFLY_ACCESS_KEY, FIREFLY_SECRET_KEY |
| github-official | GitHub's official MCP Server. Interact with GitHub repositories, issues, pull requests, and more directly from Claude. | GITHUB_PERSONAL_ACCESS_TOKEN |
| grafana | A Model Context Protocol server for interacting with Grafana dashboards and monitoring. Supports both self-hosted Grafana instances and Grafana Cloud. | GRAFANA_URL, GRAFANA_SERVICE_ACCOUNT_TOKEN, GRAFANA_USERNAME, GRAFANA_PASSWORD |
| huggingface | Access Hugging Face models, datasets, Spaces, papers, collections via MCP. |  |
| imagesorcery-mcp | An MCP server providing tools for image processing operations |  |
| ios-simulator | Control iOS Simulator directly from Claude Code. Launch apps, take screenshots, manage device states, and streamline mobile development workflows. |  |
| jfrog | JFrog MCP Server: providing your agents with direct access to JFrog Platform services. |  |
| jina-ai | Official Jina AI MCP Server for web reading, search, grounding, and fact-checking capabilities powered by Jina AI APIs. | JINA_API_KEY |
| jupyter | Model Context Protocol server for Jupyter notebooks. Execute code, manage notebooks, and interact with Jupyter kernels directly from Claude. | JUPYTER_URL, JUPYTER_TOKEN |
| just-mcp | Execute Just commands and task runners seamlessly from Claude Code. Manage project tasks, run build scripts, and automate development workflows with Just integration. |  |
| LaunchDarkly | Official LaunchDarkly MCP Server for feature flag management and experimentation. Enables AI agents to interact with LaunchDarkly APIs for managing feature flags, AI configs, targeting rules, and gradual rollouts across multiple environments. |  |
| leetcode | A Model Context Protocol (MCP) server for LeetCode that enables AI assistants to access LeetCode problems, user information, and contest data. |  |
| logfire | Provides access to OpenTelemetry traces and metrics through Logfire. |  |
| markitdown | Convert various file formats (PDF, Word, Excel, images, audio) to Markdown. |  |
| mcp-server-box | The Box MCP Server is a Python project that integrates with the Box API to perform various operations such as file search, text extraction, AI-based querying, and data extraction. It leverages the box-sdk-gen library and provides a set of tools to interact wi… |  |
| mermaid | Generate Mermaid diagrams and charts dynamically with AI. Create flowcharts, sequence diagrams, class diagrams, and more via MCP. |  |
| MongoDB | A Model Context Protocol server to connect to MongoDB databases and MongoDB Atlas Clusters. | MDB_MCP_CONNECTION_STRING |
| nika | Read-only oracle for Nika AI workflows (.nika.yaml): validate a workflow, get findings explained with fix guidance, browse schema and examples, and see an honest cost estimate — all before a single token is spent. No execution and no mutation over MCP by desi… |  |
| postman-api-http-server | Postman's MCP server connects AI agents, assistants, and chatbots directly to your APIs on Postman. Use natural language to prompt AI to automate work across your Postman collections, environments, workspaces, and more. |  |
| pulumi | The Pulumi Model Context Protocol (MCP) server enables advanced Infrastructure as Code development capabilities for connected agents, providing tools for cloud resource discovery and management using Pulumi Cloud and the Pulumi CLI. |  |
| Railway | Railway MCP server provides seamless integration with Railway's deployment platform, enabling Claude to manage projects, deployments, and infrastructure directly from the CLI. |  |
| sentry | Official Sentry MCP Server (local). Run Sentry integration locally via npx for debugging, error tracking, and performance monitoring. | SENTRY_ACCESS_TOKEN |
| sentry | This service implements the Model Context Protocol (MCP) for interacting with Sentry, focused on human-in-the-loop coding agents and developer workflows rather than general-purpose API access. |  |
| serena | Semantic code retrieval & editing tools for coding agents. |  |
| stripe | Let your AI agents interact with the Stripe API by using our MCP server. | STRIPE_SECRET_KEY |
| terraform | The Terraform MCP Server is a Model Context Protocol (MCP) server that provides seamless integration with Terraform Registry APIs, enabling advanced automation and interaction capabilities for Infrastructure as Code (IaC) development. |  |
| TestSprite | TestSprite’s MCP reads your intent, tests your code, and tells you what to fix. | API_KEY |
| trace-mcp | Framework-aware code intelligence — semantic navigation, impact analysis, and refactoring across 60 framework integrations and 81 languages with up to 99% token reduction. |  |
| trello |  | TRELLO_API_KEY, TRELLO_TOKEN |
| webflow | Enable AI agents to interact with Webflow APIs. |  |
| zai-mcp-server | Vision MCP Server - Z.AI capability implementation based on the Model Context Protocol (MCP), providing powerful Z.AI GLM-4.6V capabilities for MCP-compatible clients such as Claude Code and Cline, including image analysis, video understanding, and other feat… | Z_AI_API_KEY, Z_AI_MODE |
