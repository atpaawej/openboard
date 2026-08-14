# Security Policy

## Supported Versions

We provide security updates and patches for the current and latest releases of OpenBoard:

| Version | Supported          |
| :------ | :----------------- |
| `0.1.x` | :white_check_mark: |
| `< 0.1` | :x:                |

---

## Reporting a Vulnerability

OpenBoard takes the security of our users and AI integration pipelines very seriously.

If you discover a security vulnerability or suspect an issue with:
* Local SQLite database access or serialization injection
* MCP stdio / SSE transport parsing
* Web server binding security (default localhost-only isolation)

**Please DO NOT report security vulnerabilities through public GitHub issues.**

### How to Report

Please report security issues via:
1. **GitHub Private Vulnerability Reporting:** Open a private advisory on the [OpenBoard Security Advisories](https://github.com/atpaawej/openboard/security/advisories/new) page.
2. **Email:** Contact the maintainers directly at `aawejpathan@gmail.com` with the subject line `[SECURITY] OpenBoard Vulnerability Report`.

Please include:
* Description of the vulnerability and potential impact.
* Steps to reproduce the issue (including any minimal reproduction scripts or MCP tool call payloads).
* Suggested remediation or fix, if available.

### Response Timeline
- **Initial Response:** Within 48 hours.
- **Triage & Status Update:** Within 5 business days.
- **Fix & Public Advisory:** Coordinated release and disclosure once a patch is verified.
