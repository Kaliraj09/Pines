/* ============================================================
   Pines · services/backup-reminder.js
   Backup reminder
   ============================================================ */
/* ---- Backup reminder ---- */
const REM={'Daily':1,'Weekly':7,'Every 2 weeks':14,'Monthly':30};
function remDue(){if(!S.set.remind||!S.scripts.length)return 0;const last=S.set.lastBackup||S.set.first||Date.now(),now=Date.now();return now>=last+(REM[S.set.remEvery]||7)*864e5&&now>=(S.set.snooze||0)?Math.max(1,Math.floor((now-last)/864e5)):0}
function remHTML(){const d=remDue();if(!d)return'';return `<div class="rem">${I('shield',24)}<div><b>Time to back up your scripts</b><span>${S.set.lastBackup?`Last backup was ${d} day${d>1?'s':''} ago.`:'You haven’t made a backup yet.'} Browser data can be cleared, so keep a copy somewhere safe.</span></div><div class="rwb"><button class="pri" data-a="bk">${I('download',16)}Download backup</button><button data-a="rsnz">Remind me tomorrow</button></div></div>`}
