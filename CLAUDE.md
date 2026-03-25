# My Agent — Sabbatical Project

## Project Overview
Personal productivity suite built during
Sabbatical 2026 using Vibe Coding with
Claude Code. Zero prior coding experience.

Live URL: https://fpfe.github.io/my-agent/

## Tech Stack
- Pure HTML + CSS + JavaScript (no frameworks)
- Anthropic API for AI features
  (key stored in localStorage as 'ja2_apikey')
- Google Calendar API for calendar integration
  (Client ID: 222500308682-9eivs5899jtojlqfp2opado9efraf73m.apps.googleusercontent.com)
- Google Drive API for cloud backup
- GitHub Pages for hosting

## File Structure
- index.html — Sabbatical Command Center (hub)
- todo.html — Todo list app
- daily-planner.html — Daily planner (4-step)
- job-agent.html — Job search agent
- ai-tracker.html — AI learning tracker
- prompt-bank.html — Prompt library
- weekly-review.html — Weekly review
- interview-recorder.html — Interview recorder
- calorie-tracker.html — Calorie tracker (iPhone)
- headout_potential.html — Headout market research
- deploy.sh — One-command deployment to GitHub

## Key Rules
1. Always use dark navy theme (#0f172a background)
2. Save data to localStorage AND sync to
   Google Drive for cloud backup
   Drive files:
   - sabbatical_job_pipeline.json (job pipeline)
   - sabbatical_daily_log.json (daily learning log)
3. API key: always read from
   localStorage.getItem('ja2_apikey')
4. After any change always run ./deploy.sh
5. Mobile-friendly design required
6. Shared job pipeline key: 'shared_job_pipeline'
   (used by both index.html and job-agent.html)

## Common Commands
- Deploy: cd ~/my-agent && ./deploy.sh
- GitHub MCP: already configured
- Local server: open index.html directly
  or use port 8080

## Owner
Seungjun Ahn, Tokyo Japan
Sabbatical: March 17 - May 31, 2026
GitHub: fpfe/my-agent
