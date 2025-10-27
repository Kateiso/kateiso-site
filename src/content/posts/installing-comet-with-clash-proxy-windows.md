---
title: Installing Comet on Windows with Clash Proxy
description: Install Comet reliably behind Clash for Windows by running the installer through temporary PowerShell proxy variables and avoiding common connection pitfalls.
type: Guide
date: 2025-10-01
summary: Run the Comet installer behind Clash for Windows by setting temporary PowerShell proxy vars and avoiding common connection pitfalls.
tags: [windows, proxy, tools]
---

When running Comet behind Clash for Windows, the installer may fail to fetch dependencies. The simplest workaround is to launch PowerShell with temporary proxy variables so only the installation session is proxied.

## Steps

1. Open PowerShell (Admin) and export proxy variables:

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

2. Run the Comet installer from the same session.

3. Clear variables after install:

```powershell
Remove-Item Env:\HTTP_PROXY; Remove-Item Env:\HTTPS_PROXY
```

This isolates proxy effects and avoids system‑wide changes.

