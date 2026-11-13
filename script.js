/* CaseCraft — fictional investigation training experience.
   All case data is invented. Progress is stored locally in this browser. */
const CASES = [
  {
    id:"midnight", number:"CC-001", title:"The Midnight Breach", type:"DATA BREACH", difficulty:"BEGINNER", tone:"tone-green",
    summary:"A student portal was accessed after midnight. Three people had a reason to be near the system. Follow the digital trail.",
    briefing:"At 12:14 AM, the fictional Northbridge College student portal recorded an unusual login. A confidential event list was downloaded shortly afterward. No real systems were accessed during this simulation.",
    incident:"Unauthorized portal access · 12:14 AM",
    suspects:[
      {name:"Aarav Mehta",role:"IT Support Intern",detail:"Had temporary support access earlier that evening."},
      {name:"Mira Sen",role:"Student Event Coordinator",detail:"Was preparing the event list and reported a login issue."},
      {name:"Kabir Das",role:"Former Volunteer",detail:"His volunteer access was supposed to have expired last week."}
    ],
    culprit:2,
    evidence:[
      {title:"Access log extract",type:"SYSTEM LOG",description:"The login record shows account 'k.das' authenticated at 12:14 AM from a device not seen in the previous 30 days."},
      {title:"Account status notice",type:"ADMIN RECORD",description:"The volunteer account belonging to Kabir Das was marked for deactivation, but the access-control update was not completed."},
      {title:"Support desk note",type:"EMAIL NOTE",description:"Aarav's support session ended at 8:05 PM. The system log shows no active support session at the time of the incident."},
      {title:"Coordinator message",type:"MESSAGE",description:"Mira reported the event-list download as suspicious at 12:31 AM. Her account shows no login during the incident window."}
    ],
    explanation:"The strongest evidence points to Kabir Das: the access log identifies the account used, and the admin record confirms that the account should already have been deactivated. The other two suspects have evidence that weakens the case against them."
  },
  {
    id:"vanishing", number:"CC-002", title:"The Vanishing Files", type:"DIGITAL THEFT", difficulty:"INTERMEDIATE", tone:"tone-purple",
    summary:"A design team's project folder disappeared before a presentation. Reconstruct the sequence and identify the likely insider.",
    briefing:"A fictional design studio reports that its shared project folder disappeared at 6:40 PM, the evening before a client presentation. The team has provided a few records for your review.",
    incident:"Project folder deletion · 6:40 PM",
    suspects:[
      {name:"Riya Kapoor",role:"Lead Designer",detail:"Owned the project folder and had editing permissions."},
      {name:"Dev Malhotra",role:"Temporary Contractor",detail:"Had temporary access that ended on the day of the incident."},
      {name:"Nikhil Roy",role:"Studio Assistant",detail:"Was working late and helped prepare the presentation."}
    ],
    culprit:1,
    evidence:[
      {title:"Shared drive activity",type:"AUDIT LOG",description:"A delete action was recorded at 6:40 PM under the temporary contractor profile 'dev.m'."},
      {title:"Access expiry email",type:"EMAIL",description:"Dev received a reminder that his access would expire at midnight, several hours after the deletion event."},
      {title:"Designer workstation note",type:"DEVICE NOTE",description:"Riya's workstation was logged out at 6:12 PM. No further activity is recorded from her device."},
      {title:"Assistant's handover",type:"STATEMENT",description:"Nikhil's handover checklist says he left the studio at 6:20 PM and did not access the shared drive afterward."}
    ],
    explanation:"The audit log directly associates the deletion action with Dev's temporary contractor profile. The access-expiry email provides context, while the other records place Riya and Nikhil away from the system activity."
  },
  {
    id:"silent", number:"CC-003", title:"The Silent Impersonator", type:"IDENTITY FRAUD", difficulty:"ADVANCED", tone:"tone-amber",
    summary:"A staff member received messages from an account pretending to be the director. Separate the real communication from the impersonation.",
    briefing:"A fictional organization received an urgent payment instruction from an account that appeared to belong to its director. The instruction was questioned before any payment was made.",
    incident:"Impersonation attempt · 10:22 AM",
    suspects:[
      {name:"Tara Bose",role:"Office Administrator",detail:"Manages the organization's internal contact directory."},
      {name:"Sameer Ali",role:"External Vendor",detail:"Frequently communicates with the finance team."},
      {name:"Ishan Verma",role:"Communications Assistant",detail:"Can publish messages to the internal announcement channel."}
    ],
    culprit:0,
    evidence:[
      {title:"Sender address comparison",type:"EMAIL HEADER",description:"The suspicious message came from director.office@northbrldge.example. The verified directory lists director.office@northbridge.example."},
      {title:"Directory change request",type:"ADMIN RECORD",description:"A contact-directory edit request was submitted using Tara's administrator profile two days before the message."},
      {title:"Vendor communication log",type:"MESSAGE LOG",description:"Sameer's last recorded message was a routine invoice query three days before the incident."},
      {title:"Announcement channel audit",type:"SYSTEM LOG",description:"Ishan did not publish or edit any internal announcement during the incident window."}
    ],
    explanation:"The evidence most strongly implicates Tara's administrator profile because it was used to submit the directory change request that introduced the lookalike address. The records do not establish every detail of who sent the email, but they identify the strongest lead."
  }
];

const STORAGE_KEY = "casecraft_progress_v1";
let state = loadState();
let currentCase = null;
let selectedSuspect = null;
let currentFilter = "all";

function loadState(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {reviewed:[],solved:{},activity:[]}; }
  catch { return {reviewed:[],solved:{},activity:[]}; }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function escapeHTML(value){ return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function addActivity(message){
  state.activity.unshift({message,time:new Date().toLocaleString()});
  state.activity=state.activity.slice(0,8); saveState(); renderActivity();
}
function toast(message){
  const el=document.getElementById("toast"); el.textContent=message; el.classList.add("show");
  clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2600);
}
function go(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  const target=document.getElementById(view+"View"); if(target) target.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  const names={dashboard:"OVERVIEW",cases:"CASE FILES",board:"EVIDENCE BOARD",reports:"REPORTS"};
  document.getElementById("crumb").textContent=names[view]||"CASE DETAIL";
  document.getElementById("sidebar").classList.remove("open");
  if(view==="dashboard") renderDashboard();
  if(view==="cases") renderCases();
  if(view==="board") renderBoard();
  if(view==="reports") renderReports();
  window.scrollTo({top:0,behavior:"smooth"});
}
function caseCard(c){
  const done=!!state.solved[c.id];
  return `<article class="case-card" data-card-case="${c.id}" tabindex="0" role="button" aria-label="Open ${escapeHTML(c.title)}">
    <div class="case-cover ${c.tone}" data-code="${c.number.slice(-3)}"><span class="case-type">${c.type}</span><span class="case-number">${c.number} / DIGITAL EVIDENCE UNIT</span></div>
    <div class="case-body"><div class="case-meta"><span class="difficulty">${c.difficulty} · ${c.evidence.length} CLUES</span><span class="status-tag ${done?"done":""}">${done?"✓ SOLVED":"● OPEN"}</span></div>
    <h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.summary)}</p><div class="case-foot"><span>INVESTIGATION FILE</span><b>${done?"VIEW REPORT":"OPEN FILE"} →</b></div></div></article>`;
}
function bindCards(){
  document.querySelectorAll("[data-card-case]").forEach(card=>{
    const open=()=>openCase(card.dataset.cardCase);
    card.addEventListener("click",open); card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
}
function renderDashboard(){
  document.getElementById("dashboardCases").innerHTML=CASES.map(caseCard).join(""); bindCards();
  document.getElementById("solvedCount").innerHTML=`${Object.keys(state.solved).length}<span>/3</span>`;
  document.getElementById("evidenceCount").innerHTML=`${state.reviewed.length}<span>/12</span>`;
  const xp=Object.keys(state.solved).length*100+state.reviewed.length*10;
  document.getElementById("xpCount").textContent=String(xp).padStart(3,"0");
  const rank=xp>=400?"SENIOR":xp>=200?"ANALYST":xp>=80?"OPERATIVE":"CADET";
  document.getElementById("rankValue").textContent=rank;
  document.getElementById("rankHint").textContent=rank==="SENIOR"?"Top training rank achieved":"Keep investigating to rank up";
  renderActivity();
}
function renderActivity(){
  const el=document.getElementById("activityList");
  if(!state.activity.length){el.innerHTML='<div class="empty-activity">Your investigation activity will appear here.</div>';return;}
  el.innerHTML=state.activity.slice(0,5).map(a=>`<div class="activity-item"><span class="activity-dot"></span><div><p>${escapeHTML(a.message)}</p><small>${escapeHTML(a.time)}</small></div></div>`).join("");
}
function renderCases(){
  const query=(document.getElementById("caseSearch").value||"").toLowerCase();
  const filtered=CASES.filter(c=>{
    const matches=(c.title+" "+c.type+" "+c.summary).toLowerCase().includes(query);
    const done=!!state.solved[c.id];
    return matches&&(currentFilter==="all"||(currentFilter==="solved"&&done)||(currentFilter==="open"&&!done));
  });
  document.getElementById("allCases").innerHTML=filtered.length?filtered.map(caseCard).join(""):'<div class="empty-board">No case files match your search.</div>';
  bindCards();
}
function openCase(id){
  currentCase=CASES.find(c=>c.id===id); if(!currentCase)return;
  renderCaseDetail(); go("caseDetail");
}
function renderCaseDetail(){
  const c=currentCase, done=!!state.solved[c.id];
  document.getElementById("caseDetail").innerHTML=`
    <div class="detail-header"><div class="detail-id">${c.number} · ${c.type} · ${c.difficulty}</div><h1>${escapeHTML(c.title)}</h1><p>${escapeHTML(c.briefing)}</p></div>
    <div class="detail-layout">
      <div class="detail-panel"><div class="eyebrow">THE EVIDENCE ROOM</div><h3>Collected evidence <span style="color:#71839d;font:10px var(--mono)">(${c.evidence.filter((e,i)=>state.reviewed.includes(c.id+"-"+i)).length}/${c.evidence.length} reviewed)</span></h3>
        <div class="evidence-list">${c.evidence.map((e,i)=>{const reviewed=state.reviewed.includes(c.id+"-"+i);return `<div class="evidence-item"><div class="evidence-number">${String(i+1).padStart(2,"0")}</div><div class="evidence-copy"><b>${escapeHTML(e.title)}</b><p>${reviewed?escapeHTML(e.description):"Evidence is sealed. Examine this item to reveal its contents."}</p><small style="display:block;color:#647b97;font:8px var(--mono);margin-top:6px">${e.type}</small></div><button class="${reviewed?"reviewed":""}" data-review="${i}" ${reviewed?"disabled":""}>${reviewed?"✓ Reviewed":"Examine"}</button></div>`}).join("")}</div>
      </div>
      <div class="detail-panel"><div class="eyebrow">PERSONS OF INTEREST</div><h3>Suspect profiles</h3><div class="suspect-list">${c.suspects.map((s,i)=>`<div class="suspect-card"><div class="suspect-role">SUSPECT 0${i+1}</div><b>${escapeHTML(s.name)}</b><small>${escapeHTML(s.role)}<br/>${escapeHTML(s.detail)}</small></div>`).join("")}</div>
      <div class="case-note">⚑ <b>Investigator note:</b> Read all evidence before submitting your conclusion. This is a fictional training scenario.</div>
      <button class="primary-btn case-action" id="makeConclusion" ${done?"disabled":""}>${done?"✓ Case completed":"Submit final conclusion"} <span>→</span></button>
      ${done?`<p style="font-size:10px;color:var(--green);margin:10px 0 0">Your report is ready in the Reports section.</p>`:""}
      </div>
    </div>`;
  document.querySelectorAll("[data-review]").forEach(btn=>btn.addEventListener("click",()=>reviewEvidence(Number(btn.dataset.review))));
  document.getElementById("makeConclusion").addEventListener("click",()=>openConclusion());
}
function reviewEvidence(index){
  const key=currentCase.id+"-"+index;
  if(!state.reviewed.includes(key)){
    state.reviewed.push(key); saveState(); addActivity(`Reviewed evidence: ${currentCase.evidence[index].title} (${currentCase.number})`);
    renderCaseDetail(); updateDashboardStats(); toast("Evidence added to your investigation board.");
  }
}
function updateDashboardStats(){
  document.getElementById("solvedCount").innerHTML=`${Object.keys(state.solved).length}<span>/3</span>`;
  document.getElementById("evidenceCount").innerHTML=`${state.reviewed.length}<span>/12</span>`;
  const xp=Object.keys(state.solved).length*100+state.reviewed.length*10;
  document.getElementById("xpCount").textContent=String(xp).padStart(3,"0");
  const rank=xp>=400?"SENIOR":xp>=200?"ANALYST":xp>=80?"OPERATIVE":"CADET";
  document.getElementById("rankValue").textContent=rank;
  document.getElementById("rankHint").textContent=rank==="SENIOR"?"Top training rank achieved":"Keep investigating to rank up";
}
function openConclusion(){
  const reviewed=currentCase.evidence.filter((e,i)=>state.reviewed.includes(currentCase.id+"-"+i)).length;
  if(reviewed<currentCase.evidence.length){toast("Examine all evidence before submitting your conclusion.");return;}
  selectedSuspect=null; document.getElementById("reasonInput").value=""; document.getElementById("answerFeedback").textContent="";
  document.getElementById("suspectChoices").innerHTML=currentCase.suspects.map((s,i)=>`<button class="suspect-choice" data-suspect="${i}"><span class="choice-radio"></span><span><b>${escapeHTML(s.name)}</b><br/><small style="color:#8192aa">${escapeHTML(s.role)}</small></span></button>`).join("");
  document.querySelectorAll("[data-suspect]").forEach(btn=>btn.addEventListener("click",()=>{selectedSuspect=Number(btn.dataset.suspect);document.querySelectorAll(".suspect-choice").forEach(x=>x.classList.toggle("selected",x===btn));}));
  document.getElementById("submitConclusion").textContent="Submit conclusion →";
  document.getElementById("submitConclusion").disabled=false;
  document.getElementById("modalBackdrop").classList.add("show");
}
function submitConclusion(){
  if(selectedSuspect===null){toast("Select a suspect first.");return;}
  const correct=selectedSuspect===currentCase.culprit;
  const feedback=document.getElementById("answerFeedback");
  if(!correct){
    feedback.className="answer-feedback bad";
    feedback.textContent="That conclusion is not supported by the strongest evidence. Revisit the clues and try again. No progress has been lost.";
    return;
  }
  const reason=document.getElementById("reasonInput").value.trim();
  state.solved[currentCase.id]={suspect:currentCase.suspects[selectedSuspect].name,reason,completedAt:new Date().toLocaleString(),score:100};
  saveState(); addActivity(`Solved ${currentCase.number}: ${currentCase.title}`);
  feedback.className="answer-feedback good";
  feedback.textContent="Correct conclusion. The evidence supports your finding. Your case report has been generated.";
  document.getElementById("submitConclusion").textContent="Case solved ✓";
  document.getElementById("submitConclusion").disabled=true;
  updateDashboardStats();
  setTimeout(()=>{document.getElementById("modalBackdrop").classList.remove("show");renderCaseDetail();toast("Case solved! Your report is ready.");},1600);
}
function renderBoard(){
  const reviewed=[];
  CASES.forEach(c=>c.evidence.forEach((e,i)=>{if(state.reviewed.includes(c.id+"-"+i))reviewed.push({c,e,i});}));
  document.getElementById("boardCount").textContent=String(reviewed.length).padStart(2,"0");
  document.getElementById("evidenceBoard").innerHTML=reviewed.length?reviewed.map(({c,e,i})=>`<article class="evidence-tile"><div class="tile-top"><span>${c.number}</span><span>✓ VERIFIED</span></div><h4>${escapeHTML(e.title)}</h4><p>${escapeHTML(e.description)}</p><small>${e.type} · ${c.title}</small></article>`).join(""):'<div class="empty-board">No evidence reviewed yet.<br/><br/>Open a case file and examine its clues to build your evidence board.</div>';
}
function renderReports(){
  const solved=CASES.filter(c=>state.solved[c.id]);
  document.getElementById("reportList").innerHTML=solved.length?solved.map(c=>`<div class="report-row"><div><b>${escapeHTML(c.title)}</b><small>${c.number} · COMPLETED ${escapeHTML(state.solved[c.id].completedAt)}</small></div><button data-report="${c.id}">Download ↧</button></div>`).join(""):'<div class="empty-activity">No completed reports yet. Solve a case to generate your first report.</div>';
  document.querySelectorAll("[data-report]").forEach(btn=>btn.addEventListener("click",()=>downloadReport(btn.dataset.report)));
}
function downloadReport(id){
  const c=CASES.find(x=>x.id===id), result=state.solved[id]; if(!c||!result)return;
  const reviewed=c.evidence.filter((e,i)=>state.reviewed.includes(c.id+"-"+i));
  const content=`CASECRAFT — DIGITAL INVESTIGATION REPORT
FICTIONAL TRAINING SIMULATION

CASE: ${c.number} — ${c.title}
CASE TYPE: ${c.type}
INCIDENT: ${c.incident}
COMPLETED: ${result.completedAt}

INVESTIGATOR
Name: Dhrub Gotyal
Enrollment ID: ADTU/1/2025-29/BCSS/073
Faculty Supervisor: Raj Paul

INVESTIGATION BRIEF
${c.briefing}

EVIDENCE REVIEWED
${reviewed.map((e,i)=>`${i+1}. ${e.title} (${e.type})\n   ${e.description}`).join("\n\n")}

FINAL CONCLUSION
Most likely responsible party: ${result.suspect}
Investigator's reasoning: ${result.reason||"No additional reasoning submitted."}

CASE FINDING
${c.explanation}

SCORE: 100 XP
NOTE: All names, organizations, events and records in this project are fictional. This report is generated for educational demonstration only and is not a real forensic finding.
`;
  const blob=new Blob([content],{type:"text/plain"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=`${c.number}-Investigation-Report.txt`;a.click();URL.revokeObjectURL(url);toast("Report downloaded.");
}
document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>go(btn.dataset.view)));
document.querySelectorAll("[data-open-case]").forEach(btn=>btn.addEventListener("click",()=>openCase(btn.dataset.openCase)));
document.querySelectorAll(".filter-pill").forEach(btn=>btn.addEventListener("click",()=>{currentFilter=btn.dataset.filter;document.querySelectorAll(".filter-pill").forEach(x=>x.classList.toggle("active",x===btn));renderCases();}));
document.getElementById("caseSearch").addEventListener("input",renderCases);
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("modalBackdrop").classList.remove("show"));
document.getElementById("modalBackdrop").addEventListener("click",e=>{if(e.target.id==="modalBackdrop")e.currentTarget.classList.remove("show");});
document.getElementById("submitConclusion").addEventListener("click",submitConclusion);
document.getElementById("mobileMenu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("resetProgress").addEventListener("click",()=>{
  if(confirm("Reset all CaseCraft progress on this browser? This cannot be undone.")){
    state={reviewed:[],solved:{},activity:[]};saveState();renderDashboard();toast("Demo progress reset.");
    if(document.getElementById("casesView").classList.contains("active"))renderCases();
  }
});
renderDashboard();
