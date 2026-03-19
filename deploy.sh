#!/bin/bash
cd ~/my-agent
git add .
git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
git push origin main
echo "✅ Published to https://fpfe.github.io/my-agent/"
