---
title: Wiring MCP and Chrome DevTools for Creative Workflows
description: "High‑leverage setup day: I connected MCP in Codex CLI, brought the Chrome DevTools MCP online, and stitched small automations with n8n so daily creative work feels lighter and faster."
type: Field note
date: 2025-10-21
summary: Wired MCP + Chrome DevTools in Codex, automated X posting and research capture with n8n, and noted a few rules for choosing tools without overthinking.
tags: [mcp, chrome-devtools, n8n, productivity, workflow]
---

Some days feel like lifting a heavy door off its hinges; today was one. I set up MCP in Codex CLI, brought the Chrome DevTools MCP online, and glued together small n8n flows so the “busywork” parts of creating show up with less weight.

## Why I did this

I’m studying interaction design (BJTU × Lancaster) and building a practice around creative systems. My notes, videos, and posts move faster when the tools hum in the background.

## What clicked today

- MCP in Codex CLI: once providers are configured, Codex reaches local/remote tools through stable interfaces. Less context juggling, more doing.
- Chrome DevTools MCP: terminal control over the browser makes repeatable checks feel like second nature.
- n8n helpers: a tiny flow for X posts; another that funnels videos into a notes workspace for quick summaries.
- A small win: I wrapped a video assignment (ScreenStudio + CapCut) and actually felt good about the pace.

## Notes to future me

- Write prompts like function contracts. They’re living APIs, not one‑offs.
- Use the tool that’s still moving. DevTools MCP beats older browser automation now.
- When click paths matter, learn from short videos; they carry the “feel” that docs miss.

### Pointers

- Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Context/Docs MCPs are great for pulling current docs when coding.

## Tiny automations shipped

- X posting: templates + schedule in n8n.
- Research capture: auto‑download → summarize in NotebookLM (or similar) → stash for review.

## What worked

1) Plan the day with clear blocks; make tasks smaller than they feel.
2) A short nap resets the afternoon.
3) Stack little wins; they add up.

## Could be better

- Proxy rules need trimming; not every site needs it.
- A small VPS would remove the friction I keep hitting on free tiers.

## Next

- Expand DevTools MCP scripts for QA/data collection.
- Formalize an “Agent IDE” where the terminal chat and a code model work in parallel.
- Keep the diary → summary → publish loop alive.
