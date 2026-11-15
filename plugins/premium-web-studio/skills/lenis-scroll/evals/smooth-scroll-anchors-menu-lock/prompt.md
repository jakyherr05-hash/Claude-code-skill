---
tags: [premium-web-studio, lenis]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

can you add proper smooth scrolling to this little vite + react landing page? we already use gsap scrolltrigger for a couple of reveals (see App.tsx). the header is fixed and 72px tall, so nav links like #pricing currently land under it. also the mobile menu overlay should stop the page scrolling behind it while it's open. please make it production quality — i don't want two scroll loops fighting or anything that breaks keyboard scrolling. just edit the files, no need to npm install.

Input files: package.json, src/App.tsx, src/main.tsx, src/index.css
