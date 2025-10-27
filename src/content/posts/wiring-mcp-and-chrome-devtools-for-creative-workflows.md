---
title: Wiring MCP and Chrome DevTools for Creative Workflows
description: A day of high‑leverage setup — connecting MCP in Codex CLI, enabling the Chrome DevTools MCP, and automating social + research flows with n8n to accelerate creative work.
type: Field note
date: 2025-10-21
summary: Connected MCP and Chrome DevTools inside Codex, automated X posting and research capture with n8n, and reflected on planning and tool choice heuristics.
tags: [mcp, chrome-devtools, n8n, productivity, workflow]
---

I had one of those compounding setup days where infrastructure unlocks future speed. I wired up MCP in Codex CLI, enabled the Chrome DevTools MCP, and shipped small automations that I’ll reuse daily.

## Context

I’m studying interaction design (BJTU × Lancaster) and building a practice around creative systems. Today’s focus was tuning the toolchain that supports research, note capture, and publishing.

## Highlights

- MCP inside Codex CLI. After configuring MCP providers, Codex can reach local/remote tools with stable interfaces.
- Chrome DevTools MCP online. With the DevTools MCP, I can introspect and control the browser directly from the terminal—perfect for repeatable, scriptable checks.
- n8n automations. A minimal flow publishes X posts on a schedule and pipelines videos into a notes workspace for summarization.
- Video assignment shipped. Edited and exported with ScreenStudio + CapCut, then submitted once the portal opened.

## Setup notes

- Treat prompts as evolving APIs; write them like function contracts.
- Prefer up‑to‑date, well‑maintained tools (DevTools MCP > older browser automation).
- Videos beat long text for learning tools when click paths matter.

### Quick pointers

- Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Context/Docs MCPs are great for pulling current docs into the loop when coding.

## Micro‑automations built

- X posting: templated messages + schedule via n8n.
- Research capture: download videos → route to NotebookLM (or alt) for summarization and rapid review.

## What worked

1) Plan the day with SMART blocks and break tasks smaller than they feel.  
2) Short naps keep the afternoon sharp.  
3) Stack tiny wins; momentum compounds.

## Improvements

- Tighten proxy rules; some sites don’t need the proxy path.
- Decide on a dedicated VPS for self‑hosted services with fewer limits than free tiers.

## Next

- Extend DevTools MCP scripts for repeat QA and data collection.  
- Formalize an “Agent IDE” setup where terminal chat and a code model co‑operate in parallel.  
- Continue integrating diary → summary → publish loops.

