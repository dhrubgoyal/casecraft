# CaseCraft — Digital Investigation Bureau

A responsive, browser-based fictional cybercrime investigation simulator built with **HTML, CSS and vanilla JavaScript**.

## Student project details

- **Student:** Dhrub Gotyal
- **Enrollment ID:** ADTU/1/2025-29/BCSS/073
- **Faculty Supervisor:** Raj Paul
- **Project:** CaseCraft — Digital Investigation Bureau

## What is CaseCraft?

CaseCraft is an interactive learning experience in which a user takes the role of a junior digital investigator. The user opens fictional case files, reads suspect profiles, examines evidence, connects clues and submits a conclusion. Correct conclusions unlock downloadable investigation reports.

All case names, people, organizations, records and incidents are fictional. This project does not connect to real systems or perform real forensic analysis.

## Features

- Investigation dashboard with XP, rank and progress statistics
- Three fictional cybercrime case studies
- Search and filter case files
- Evidence examination and evidence board
- Suspect profiles and final-conclusion challenge
- Feedback for incorrect and correct conclusions
- Downloadable plain-text investigation reports
- Local progress saving using browser LocalStorage
- Responsive desktop and mobile layout
- Reset demo progress control
- No backend, API key, database or build tools required

## Technology

- HTML5 — application structure
- CSS3 — responsive layout, animations and visual design
- JavaScript — case logic, evidence review, scoring, reports and local persistence
- LocalStorage — saves progress in the user's browser

## Run locally

1. Download or extract this project.
2. Open `index.html` in Chrome, Edge or Firefox.
3. Start exploring the case files.

No installation is required.

## Deploy on GitHub Pages

1. Sign in to GitHub and create a **new public repository** (for example, `casecraft`).
2. Extract this ZIP file on your computer.
3. Open the extracted `casecraft-project` folder.
4. Upload **all files and folders inside it** to the root of your GitHub repository. Make sure `index.html`, `style.css` and `script.js` are at the repository root.
5. Commit the files to the `main` branch.
6. In the repository, open **Settings → Pages**.
7. Under **Build and deployment**, select **Deploy from a branch**.
8. Select branch **main** and folder **/(root)**, then click **Save**.
9. Wait for GitHub Pages to publish. Your site URL will appear in the Pages section, usually:
   `https://YOUR-USERNAME.github.io/casecraft/`

Every time you push a new commit to the selected branch, GitHub Pages will publish the updated site.

## Project structure

```text
casecraft-project/
├── index.html
├── style.css
├── script.js
├── README.md
└── PROJECT-REPORT.md
```

## How to use the application

1. Open **Case files**.
2. Select a case and read its briefing.
3. Open each evidence item using the **Examine** button.
4. Review the suspect profiles.
5. Once all clues have been examined, submit your conclusion.
6. Select the suspect supported by the evidence. Add your reasoning if you want.
7. A correct conclusion marks the case solved and creates a report.
8. Open **Reports** to download the report.

## Data and privacy

Progress is stored in LocalStorage on the current browser and device. It is not synchronized between devices and is not sent to a server. Clearing browser data may remove saved progress.

## Limitations and future scope

- Case scenarios and evidence are currently predefined.
- Progress is stored locally; there is no account system or cloud database.
- The evidence board displays reviewed evidence but does not yet support free-form drag-and-drop connections.
- A future version could add an authoring panel for creating cases, richer evidence relationships, a timed challenge mode, and an advanced cybersecurity lab.

## Testing checklist

- [ ] Dashboard loads and shows three case cards.
- [ ] Case search and filters work.
- [ ] Evidence is revealed when examined.
- [ ] Reviewed evidence appears on the evidence board.
- [ ] Conclusion cannot be submitted until all evidence is reviewed.
- [ ] Incorrect suspect selection gives feedback.
- [ ] Correct suspect selection completes the case.
- [ ] A report downloads from the Reports page.
- [ ] Progress remains after refreshing the page.
- [ ] Layout works on desktop and mobile.

---
**Educational disclaimer:** CaseCraft is a fictional training simulator. It is not a real cybercrime reporting service, security scanner or forensic tool.
