# skills-railway

Skills — railway (12): railway-database, railway-deploy, railway-deployment, railway-docs, railway-domain, ….

| Skill | Description |
|---|---|
| railway-database | Add official Railway database services (Postgres, Redis, MySQL, MongoDB). Use when user wants to add a database, says "add postgres", "add redis", "add database", "connect to database", or "wire up the database". For other templates (Ghost, Strapi, n8n), use… |
| railway-deploy | Deploy code to Railway using "railway up". Use when user wants to push code, says "railway up", "deploy", "ship", or "push". For initial setup or creating services, use railway-new skill. For Docker images, use railway-environment skill. |
| railway-deployment | Manage Railway deployments - view logs, redeploy, restart, or remove deployments. Use for deployment lifecycle (remove, stop, redeploy, restart), deployment visibility (list, status, history), and troubleshooting (logs, errors, failures, crashes). NOT for del… |
| railway-docs | Fetch up-to-date Railway documentation to answer questions accurately. Use when user asks about Railway features, how Railway works, or shares a docs.railway.com URL. |
| railway-domain | Add, view, or remove domains for Railway services. Use when user wants to add a domain, generate a railway domain, check current domains, get the URL for a service, or remove a domain. |
| railway-environment | Query, stage, and apply configuration changes for Railway environments. Use for ANY variable or env var operations, service configuration (source, build settings, deploy settings), lifecycle (delete service), and applying changes. Prefer over railway-status s… |
| railway-metrics | Query resource usage metrics for Railway services. Use when user asks about resource usage, CPU, memory, network, disk, or service performance like "how much memory is my service using" or "is my service slow". |
| railway-new | Create Railway projects, services, and databases with proper configuration. Use when user says "setup", "deploy to railway", "initialize", "create project", "create service", or wants to deploy from GitHub. Handles initial setup AND adding services to existin… |
| railway-projects | List, switch, and configure Railway projects. Use when user wants to list all projects, switch projects, rename a project, enable/disable PR deploys, make a project public/private, or modify project settings. |
| railway-service | Check service status, rename services, change service icons, link services, or create services with Docker images. For creating services with local code, prefer railway-new skill. For GitHub repo sources, use railway-new skill to create empty service then rai… |
| railway-status | Check current Railway project status for this directory. Use when user asks "railway status", "is it running", "what's deployed", "deployment status", or about uptime. NOT for variables or configuration queries - use railway-environment skill for those. |
| railway-templates | Search and deploy services from Railway's template marketplace. Use when user wants to add a service from a template, find templates for a specific use case, or deploy tools like Ghost, Strapi, n8n, Minio, Uptime Kuma, etc. For databases (Postgres, Redis, MyS… |
