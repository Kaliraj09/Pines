/* ============================================================
   Pines · core/actions-reports.js
   Report print / CSV and language list actions
   ============================================================ */
Object.assign(A,{
rprint:()=>{const s=cur();printHTML(`<html><head><meta charset="utf-8"><style>${css()}body{max-width:none}
/* Reports page redesign: plain-language hierarchy, responsive cards */
.rpt-page{display:flex;flex-direction:column;gap:22px}.rpt-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;padding:22px;border:1px solid var(--bd);border-radius:18px;background:linear-gradient(135deg,var(--card),var(--tint))}.rpt-eyebrow{font-size:10px;letter-spacing:.13em;font-weight:800;color:var(--ac);margin-bottom:7px}.rpt-hero h2{font-size:clamp(22px,3vw,30px);letter-spacing:-.035em;margin:0 0 7px}.rpt-hero p{margin:0;color:var(--mut);font-size:13px;line-height:1.55;max-width:620px}.rpt-actions,.rpt-detail-actions{display:flex;gap:8px;flex-wrap:wrap}.rpt-section{min-width:0}.rpt-section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px}.rpt-section-head h3{margin:0 0 4px;font-size:17px;letter-spacing:-.02em}.rpt-section-head p{margin:0;color:var(--mut);font-size:12px;line-height:1.5}.rpt-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.rpt-metric{padding:14px 15px;background:var(--card);border:1px solid var(--bd);border-radius:14px;min-width:0}.rpt-metric-top{display:flex;align-items:center;gap:7px;color:var(--mut);font-size:11px;font-weight:650}.rpt-metric-top span{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;background:var(--tint);color:var(--ac)}.rpt-metric strong{display:block;font-size:25px;letter-spacing:-.035em;margin:8px 0 2px;overflow-wrap:anywhere}.rpt-metric p{font-size:11px;color:var(--mut);margin:0;line-height:1.4}.rpt-insight-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.rpt-panel{min-width:0;padding:16px;background:var(--card);border:1px solid var(--bd);border-radius:15px}.rpt-panel-title{margin-bottom:12px}.rpt-panel-title b{display:block;font-size:13px}.rpt-panel-title small{display:block;font-size:11px;color:var(--mut);margin-top:3px}.rpt-wide{grid-column:1/-1}.rpt-checks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.rpt-check{display:flex;gap:10px;align-items:flex-start;padding:14px;background:var(--card);border:1px solid var(--bd);border-radius:13px;min-width:0}.rpt-check>span{width:28px;height:28px;flex:none;display:grid;place-items:center;border-radius:9px;background:var(--tint)}.rpt-check .good{color:#16865f}.rpt-check .warn{color:#b67a16}.rpt-check b{display:block;font-size:12px;line-height:1.4}.rpt-check small{display:block;color:var(--mut);font-size:11px;line-height:1.45;margin-top:4px}.rpt-library-group{padding:12px 14px;background:var(--card);border:1px solid var(--bd);border-radius:15px;margin-top:10px}.rpt-library-group h4{font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--mut);margin:2px 0 7px}.rpt-report{width:100%;display:flex;align-items:center;gap:11px;text-align:left;padding:11px 3px;border:0;border-top:1px solid var(--bd);border-radius:0;background:transparent;color:var(--tx);cursor:pointer}.rpt-report:first-of-type{border-top:0}.rpt-report:hover{background:var(--tint)}.rpt-report-icon{width:34px;height:34px;flex:none;display:grid;place-items:center;border-radius:10px;background:var(--tint);color:var(--ac)}.rpt-report-copy{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}.rpt-report-copy b{font-size:13px}.rpt-report-copy small{font-size:11px;color:var(--mut)}.rpt-report-copy em{font-size:10px;font-style:normal;color:var(--mut);opacity:.85}.rpt-report-count{font-size:11px;color:var(--mut);background:var(--tint);padding:4px 8px;border-radius:20px}.rpt-arrow{color:var(--mut);display:grid;place-items:center}.rpt-footnote,.rpt-hint{padding:12px 14px;border-radius:12px;background:var(--tint);color:var(--mut);font-size:11px;line-height:1.55}.rpt-empty{padding:26px 18px;text-align:center;border:1px dashed var(--bd);border-radius:15px;background:var(--card)}.rpt-empty>span{display:block;color:var(--ac);margin-bottom:8px}.rpt-empty b{font-size:15px}.rpt-empty p{max-width:440px;margin:6px auto 14px;color:var(--mut);font-size:12px;line-height:1.55}.rpt-detail{display:flex;flex-direction:column;gap:12px}.rpt-detail-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.rpt-back{display:flex;align-items:center;gap:6px}.rpt-detail-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0}.rpt-detail-heading h2{font-size:23px;margin:0 0 4px}.rpt-detail-heading p{font-size:12px;color:var(--mut);margin:0}.rpt-count{font-size:13px;background:var(--tint);padding:8px 12px;border-radius:20px}.rpt-search{display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid var(--bd);border-radius:11px;background:var(--card);color:var(--mut)}.rpt-search input{border:0!important;box-shadow:none!important;background:transparent!important;width:100%;max-width:none!important;min-width:0}.rpt-detail #rtbl{min-width:0}
@media(max-width:800px){.rpt-hero{align-items:flex-start;flex-direction:column;padding:17px}.rpt-actions{width:100%}.rpt-actions button{flex:1}.rpt-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rpt-metric{padding:12px}.rpt-metric strong{font-size:22px}.rpt-insight-grid{grid-template-columns:1fr}.rpt-wide{grid-column:auto}.rpt-checks{grid-template-columns:1fr}.rpt-section-head{align-items:flex-start}.rpt-report-copy em{display:none}.rpt-library-group{padding:10px 11px}}
@media(max-width:420px){.rpt-actions button{font-size:11px;padding:8px}.rpt-metric-top{font-size:10px}.rpt-report{gap:8px}.rpt-report-icon{width:30px;height:30px}.rpt-report-copy small{font-size:10px}.rpt-detail-actions{width:100%}.rpt-detail-actions button{flex:1}.rpt-detail-heading h2{font-size:20px}}

/* Editorial Studio — Reports */
.rpt-editorial{--ed-ink:var(--tx);--ed-muted:var(--mut);display:flex;flex-direction:column;gap:30px;max-width:1120px;margin:0 auto;color:var(--ed-ink)}
.ed-masthead{padding:4px 0 0}
.ed-kicker{display:flex;justify-content:space-between;gap:12px;font-size:9px;font-weight:800;letter-spacing:.16em;color:var(--mut)}
.ed-title-row{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding:32px 0 25px}
.ed-overline{font-size:9px!important;font-weight:800!important;letter-spacing:.16em!important;color:var(--ac)!important;margin:0 0 9px!important}
.ed-title-row h1{font:500 clamp(34px,5vw,54px)/1.04 Georgia,'Times New Roman',serif;letter-spacing:-.045em;margin:0 0 12px}
.ed-intro{max-width:570px;color:var(--mut);font:14px/1.7 Georgia,serif;margin:0}
.ed-export{display:flex;gap:8px;flex-wrap:wrap;flex:none}
.ed-export button{display:flex;align-items:center;gap:7px}
.ed-rule{height:1px;background:var(--bd);position:relative}
.ed-rule:after{content:'';position:absolute;left:0;top:-1px;width:58px;height:2px;background:var(--ac)}
.ed-section{padding-top:2px}
.ed-section-head{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:start;margin-bottom:18px}
.ed-index{font:italic 22px Georgia,serif;color:var(--ac);padding-top:1px}
.ed-section-head h2,.ed-empty h2{font:500 clamp(22px,3vw,29px)/1.15 Georgia,'Times New Roman',serif;letter-spacing:-.025em;margin:0 0 5px}
.ed-section-head p:not(.ed-overline){font:13px/1.5 Georgia,serif;color:var(--mut);margin:0}
.ed-stat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--bd);border-left:1px solid var(--bd)}
.rpt-metric{background:transparent!important;border:0!important;border-right:1px solid var(--bd)!important;border-bottom:1px solid var(--bd)!important;border-radius:0!important;padding:17px 16px!important}
.rpt-metric-top{font-size:10px!important;letter-spacing:.035em}
.rpt-metric-top span{width:22px!important;height:22px!important;border-radius:0!important;background:transparent!important;color:var(--ac)!important}
.rpt-metric strong{font:500 clamp(25px,3vw,34px)/1 Georgia,'Times New Roman',serif!important;letter-spacing:-.04em!important;margin:11px 0 6px!important}
.rpt-metric p{font:11px/1.45 Georgia,serif!important;color:var(--mut)!important}
.ed-analysis-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));border-top:1px solid var(--bd);border-left:1px solid var(--bd)}
.ed-analysis{min-width:0;padding:19px;border-right:1px solid var(--bd);border-bottom:1px solid var(--bd)}
.ed-analysis h3{font:500 17px Georgia,serif;margin:0 0 4px}
.ed-analysis>p{font:11px/1.5 Georgia,serif;color:var(--mut);margin:0 0 14px}
.ed-analysis-wide{grid-column:1/-1}
.ed-analysis .dn{margin-top:4px}
.ed-analysis .hb{margin:9px 0}
.ed-analysis .spk{max-height:76px}
.ed-readiness{border-top:1px solid var(--bd)}
.ed-check{display:grid;grid-template-columns:36px 22px minmax(0,1fr) auto;gap:10px;align-items:center;padding:14px 4px;border-bottom:1px solid var(--bd)}
.ed-check-no{font:italic 15px Georgia,serif;color:var(--mut)}
.ed-check>span:nth-child(2){display:grid;place-items:center}
.ed-ok{color:#258260}.ed-pending{color:#b78332}
.ed-check b{font:500 14px Georgia,serif}
.ed-check p{font:11px/1.45 Georgia,serif;color:var(--mut);margin:3px 0 0}
.ed-check>small{font-size:8px;letter-spacing:.12em;font-weight:800;color:var(--mut)}
.ed-report-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 34px}
.ed-report-group{min-width:0}
.ed-report-group h3{font-size:9px;letter-spacing:.13em;font-weight:800;color:var(--ac);padding-bottom:10px;border-bottom:1px solid var(--bd);margin:0 0 2px}
.rpt-report{padding:12px 2px!important;gap:10px!important;border-top:0!important;border-bottom:1px solid var(--bd)!important}
.rpt-report:hover{background:transparent!important}
.rpt-report-icon{width:25px!important;height:25px!important;background:transparent!important;color:var(--ac)!important;border-radius:0!important}
.rpt-report-copy b{font:500 14px Georgia,serif!important}
.rpt-report-copy small{font:11px Georgia,serif!important}
.rpt-report-copy em{display:none}
.rpt-report-count{background:transparent!important;border:1px solid var(--bd);border-radius:0!important;font-size:10px!important}
.rpt-arrow{opacity:.55}
.ed-disclaimer{font:italic 11px/1.6 Georgia,serif;color:var(--mut);border-top:1px solid var(--bd);padding-top:13px;margin:0}
.ed-empty{display:grid;grid-template-columns:48px 1fr;gap:12px;padding:25px 0 35px;border-bottom:1px solid var(--bd)}
.ed-empty p:not(.ed-overline){font:14px/1.65 Georgia,serif;color:var(--mut);max-width:520px}
.ed-empty button{display:inline-flex;align-items:center;gap:8px;margin-top:7px}
.rpt-detail{max-width:1120px;margin:0 auto}
.rpt-detail-heading{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:18px 0!important}
.rpt-detail-heading h2{font:500 30px Georgia,serif!important}
.rpt-count{background:transparent!important;border:1px solid var(--bd);border-radius:0!important}
.rpt-search{border-radius:0!important;max-width:460px}
@media(max-width:760px){
 .rpt-editorial{gap:24px}.ed-title-row{display:block;padding:25px 0 20px}.ed-export{margin-top:18px}.ed-export button{flex:1;justify-content:center}
 .ed-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
 .ed-analysis-grid{grid-template-columns:1fr}.ed-analysis-wide{grid-column:auto}
 .ed-report-groups{grid-template-columns:1fr;gap:20px}
 .ed-section-head{grid-template-columns:32px 1fr;gap:8px}
 .ed-check{grid-template-columns:27px 20px minmax(0,1fr);gap:8px}.ed-check>small{grid-column:3}
}
@media(max-width:420px){
 .ed-kicker{font-size:8px}.ed-title-row h1{font-size:36px}.ed-intro{font-size:13px}
 .rpt-metric{padding:13px 10px!important}.rpt-metric strong{font-size:27px!important}
 .ed-analysis{padding:15px}.ed-check b{font-size:13px}
}
/* Pines Reports — premium production dashboard refinement */
.rw-page{max-width:1240px;gap:28px;padding:8px 2px 30px}
.rw-header{position:relative;overflow:hidden;align-items:center;padding:25px 26px;border:1px solid var(--bd);border-radius:18px;background:linear-gradient(125deg,var(--card) 0%,var(--tint) 100%)}
.rw-header:after{content:"";position:absolute;width:230px;height:230px;right:19%;top:-150px;border:1px solid color-mix(in srgb,var(--ac) 28%,transparent);border-radius:50%;box-shadow:0 0 0 28px color-mix(in srgb,var(--ac) 5%,transparent),0 0 0 58px color-mix(in srgb,var(--ac) 4%,transparent);pointer-events:none}
.rw-header>div{position:relative;z-index:1}
.rw-eyebrow,.rw-section-tag{font-size:9px;letter-spacing:.17em}
.rw-header h1{font-size:clamp(34px,4.5vw,46px);margin:11px 0 7px;letter-spacing:-.055em}
.rw-header>div:first-child>p{max-width:490px;font-size:13px;line-height:1.6}
.rw-project{min-width:225px;border:1px solid var(--bd);border-left:3px solid var(--ac);border-radius:12px;background:color-mix(in srgb,var(--card) 88%,transparent);padding:15px 17px;box-shadow:0 8px 24px #00000008}
.rw-project b{font-size:14px}
.rw-overview{gap:16px}
.rw-overview-main{border-radius:16px;padding:22px;box-shadow:0 8px 26px #00000006}
.rw-overview-main h2,.rw-section-heading h2{font-size:21px;letter-spacing:-.035em}
.rw-stats{border:0;gap:9px;margin-top:19px}
.rw-stat{border:1px solid var(--bd);border-radius:11px;background:color-mix(in srgb,var(--bg) 55%,var(--card));padding:14px 13px;transition:transform .18s ease,border-color .18s ease}
.rw-stat:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 50%,var(--bd))}
.rw-stat strong{font-size:25px;margin:10px 0 3px}
.rw-stat-label{font-size:10px;font-weight:650}
.rw-budget-panel{position:relative;overflow:hidden;border-radius:16px;padding:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--ac) 92%,#18251f),color-mix(in srgb,var(--ac) 65%,#111827));box-shadow:0 12px 28px color-mix(in srgb,var(--ac) 20%,transparent)}
.rw-budget-panel:after{content:"";position:absolute;width:170px;height:170px;right:-65px;top:-65px;border:1px solid #ffffff35;border-radius:50%;box-shadow:0 0 0 22px #ffffff0c,0 0 0 46px #ffffff09}
.rw-budget-panel>*{position:relative;z-index:1}
.rw-budget-value{font-size:clamp(27px,3vw,36px);margin:20px 0 7px}
.rw-budget-panel button{border-radius:9px;padding:11px 13px;transition:background .18s ease}
.rw-budget-panel button:hover{background:#ffffff20}
.rw-section-heading{margin-bottom:15px}
.rw-section-heading h2{font-size:22px;margin:7px 0 5px}
.rw-live,.rw-total{padding:7px 10px;border:1px solid var(--bd);border-radius:99px;background:var(--card);font-size:8px}
.rw-analysis-grid{gap:13px}
.rw-analysis-card{min-height:150px;padding:17px;border:1px solid var(--bd);border-radius:14px;background:var(--card);box-shadow:0 6px 20px #00000005;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
.rw-analysis-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 40%,var(--bd));box-shadow:0 12px 25px #0000000b}
.rw-analysis-card h3{font-size:13px;letter-spacing:-.015em}
.rw-analysis-card>div:first-child>p{font-size:10px;line-height:1.55}
.rw-library-grid{gap:14px}
.rw-group{overflow:hidden;border:1px solid var(--bd);border-radius:14px;background:var(--card);box-shadow:0 6px 20px #00000005;transition:border-color .18s ease,box-shadow .18s ease}
.rw-group:hover{border-color:color-mix(in srgb,var(--ac) 38%,var(--bd));box-shadow:0 10px 25px #00000009}
.rw-group-head{padding:17px 17px 14px;background:linear-gradient(100deg,var(--tint),transparent 80%)}
.rw-group-head>span{display:grid;place-items:center;width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ac) 25%,var(--bd));border-radius:10px;background:var(--card);font-size:17px}
.rw-group-head h3{font-size:13px;letter-spacing:-.01em}
.rw-group-head p{font-size:10px;line-height:1.45}
.rw-group-list{padding:3px 15px}
.rw-report{gap:11px;padding:12px 3px;border-radius:8px;transition:background .16s ease,transform .16s ease}
.rw-report:hover{padding-left:7px;padding-right:7px;background:var(--tint);transform:translateX(2px)}
.rw-report-icon{width:34px;height:34px;border:1px solid color-mix(in srgb,var(--ac) 15%,var(--bd));border-radius:10px}
.rw-report-copy b{font-size:11px}
.rw-report-copy small{font-size:9px}
.rw-report-meta{min-width:25px;text-align:center;padding:4px 6px;border:1px solid var(--bd);border-radius:99px;background:var(--tint);font-weight:750}
.rw-report-arrow{font-size:19px}
.rw-attention{border-radius:12px;padding:15px 17px}
.rw-attention-icon{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--bd);border-radius:10px;background:var(--card)}
.rw-attention button{padding:8px 11px;border:1px solid var(--bd);border-radius:8px;background:var(--card)}
.rw-footer{padding-top:14px;font-size:8px}
.rw-empty{border-radius:16px;padding:34px;background:var(--card);box-shadow:0 8px 24px #00000006}
.rw-empty-art{border-radius:15px;width:64px;height:64px}
@media(max-width:850px){
 .rw-header{padding:21px}
 .rw-project{min-width:190px}
 .rw-overview-main{padding:18px}
}
@media(max-width:650px){
 .rw-page{gap:21px;padding:0 0 22px}
 .rw-header{padding:20px 17px;border-radius:14px;gap:16px}
 .rw-header:after{right:-45px;top:-160px}
 .rw-header h1{font-size:34px}
 .rw-project{min-width:0;width:100%}
 .rw-overview-main{padding:16px;border-radius:13px}
 .rw-stats{gap:7px}
 .rw-stat{padding:12px 10px;border-radius:9px}
 .rw-stat strong{font-size:22px}
 .rw-budget-panel{border-radius:13px;padding:19px}
 .rw-analysis-grid,.rw-library-grid{gap:10px}
 .rw-analysis-card{border-radius:12px;padding:15px;min-height:0}
 .rw-group{border-radius:12px}
 .rw-group-head{padding:15px}
 .rw-group-list{padding:2px 12px}
 .rw-attention{padding:13px}
 .rw-empty{padding:24px 18px}
}
@media(prefers-reduced-motion:reduce){
 .rw-stat,.rw-analysis-card,.rw-group,.rw-report,.rw-budget-panel button{transition:none}
}


/* Manual-only budget summary in Reports */
.rw-budget-breakdown{display:grid;grid-template-columns:1fr 1fr;gap:9px;width:100%;margin:0 0 17px}
.rw-budget-breakdown>span{display:flex;flex-direction:column;gap:4px;padding:10px 11px;border:1px solid #ffffff35;border-radius:9px;background:#ffffff12;min-width:0}
.rw-budget-breakdown small{font-size:9px;color:#ffffffc7}
.rw-budget-breakdown b{font-size:13px;overflow-wrap:anywhere}
.rw-budget-panel p{margin-bottom:12px}
.rw-budget-panel button{margin-top:auto}
/* Language settings workspace */
.language-settings{display:flex;flex-direction:column;gap:16px;max-width:920px}
.language-hero{display:flex;align-items:flex-start;gap:16px;padding:23px;border:1px solid var(--bd);border-radius:16px;background:linear-gradient(125deg,var(--card),var(--tint))}
.language-hero-icon{display:grid;place-items:center;width:48px;height:48px;flex:none;border:1px solid var(--bd);border-radius:13px;background:var(--bg);color:var(--ac)}
.language-kicker{display:block;font-size:9px;font-weight:800;letter-spacing:.15em;color:var(--ac);margin-bottom:7px}
.language-hero h2{font-size:25px;letter-spacing:-.04em;margin:0 0 7px}
.language-hero p,.language-default p,.language-list-head p,.language-add-copy p{font-size:12px;line-height:1.6;color:var(--mut);margin:0}
.language-default,.language-list-card,.language-add-card{padding:20px;border-radius:14px}
.language-default{display:flex;align-items:center;justify-content:space-between;gap:20px}
.language-default h3,.language-list-head h3,.language-add-copy h3{font-size:15px;margin:0 0 6px;letter-spacing:-.02em}
.language-default>div{max-width:470px}
.language-default-select{display:flex;flex-direction:column;gap:7px;width:min(260px,42%);font-size:10px;font-weight:700;color:var(--mut)}
.language-default-select select{width:100%;min-width:0}
.language-list-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}
.language-count{display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--bd);border-radius:11px;background:var(--tint);font-size:13px;font-weight:800}
.language-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.language-item{display:flex;align-items:center;gap:11px;min-width:0;padding:12px;border:1px solid var(--bd);border-radius:11px;background:var(--bg)}
.language-symbol{display:grid;place-items:center;width:37px;height:37px;flex:none;border-radius:10px;background:var(--tint);color:var(--ac);font-size:11px;font-weight:850;letter-spacing:.03em}
.language-name{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.language-name b{font-size:12px;overflow-wrap:anywhere}
.language-name small{font-size:9px;color:var(--mut)}
.language-default-badge{font-size:8px;letter-spacing:.08em;font-weight:800;color:var(--ac);padding:5px 7px;border-radius:99px;background:var(--tint)}
.language-remove{display:grid;place-items:center;width:27px;height:27px;flex:none;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--mut);font-size:17px;cursor:pointer}
.language-remove:hover{border-color:#c4473f;color:#c4473f}
.language-add-card{display:flex;align-items:flex-start;gap:13px}
.language-add-icon{display:grid;place-items:center;width:38px;height:38px;flex:none;border:1px solid var(--bd);border-radius:10px;background:var(--tint);color:var(--ac)}
.language-add-copy{min-width:0;flex:1}
.language-add-row{display:flex;gap:8px;margin-top:13px}
.language-add-row input{min-width:0;flex:1}
.language-add-row button{white-space:nowrap}
.language-note{display:flex;align-items:flex-start;gap:7px;color:var(--mut);font-size:10px;line-height:1.55;margin:0}
.language-note svg{flex:none;color:var(--ac)}
@media(max-width:620px){
 .language-settings{gap:12px}
 .language-hero{padding:17px;gap:12px}
 .language-hero-icon{width:41px;height:41px}
 .language-hero h2{font-size:22px}
 .language-default{align-items:stretch;flex-direction:column;padding:17px;gap:14px}
 .language-default-select{width:100%}
 .language-list-card,.language-add-card{padding:16px}
 .language-grid{grid-template-columns:1fr}
 .language-add-row{flex-direction:column}
 .language-add-row button{width:100%}
 .rw-budget-breakdown{gap:7px}
 .rw-budget-breakdown>span{padding:9px}
}


/* Language settings — refined workspace layout */
.language-settings-v2{width:100%;max-width:1060px;display:flex;flex-direction:column;gap:19px;color:var(--tx)}
.ls2-heading{display:flex;align-items:flex-start;gap:15px;padding:4px 1px 17px;border-bottom:1px solid var(--bd)}
.ls2-heading-mark{width:44px;height:44px;flex:none;display:grid;place-items:center;border:1px solid var(--bd);border-radius:12px;background:var(--card);color:var(--ac)}
.ls2-heading-copy{min-width:0}
.ls2-overline{font-size:9px;line-height:1.3;font-weight:800;letter-spacing:.14em;color:var(--mut)}
.ls2-heading h2{font-size:25px;line-height:1.2;letter-spacing:-.04em;margin:5px 0 6px;font-weight:750}
.ls2-heading p{max-width:620px;font-size:12px;line-height:1.6;color:var(--mut);margin:0}
.ls2-layout{display:grid;grid-template-columns:minmax(250px,.78fr) minmax(0,1.55fr);gap:15px;align-items:start}
.ls2-default-panel,.ls2-library-panel{min-width:0;border:1px solid var(--bd);border-radius:13px;background:var(--card);box-shadow:0 3px 14px #00000005}
.ls2-default-panel{padding:19px;position:relative;overflow:hidden}
.ls2-default-panel:before{content:"";position:absolute;inset:0 0 auto;height:3px;background:var(--ac)}
.ls2-panel-top{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ls2-status-dot{font-size:8px;letter-spacing:.1em;font-weight:800;color:var(--ac);padding:5px 8px;border:1px solid color-mix(in srgb,var(--ac) 25%,var(--bd));border-radius:99px;background:var(--tint)}
.ls2-default-label{font-size:11px;color:var(--mut);margin:22px 0 10px}
.ls2-current-language{display:flex;align-items:center;gap:12px;padding:13px;border:1px solid var(--bd);border-radius:10px;background:var(--bg)}
.ls2-current-code,.ls2-language-code{display:grid;place-items:center;flex:none;width:40px;height:40px;border-radius:9px;background:var(--tint);color:var(--ac);font-size:12px;font-weight:850;letter-spacing:.03em}
.ls2-current-language>div{display:flex;flex-direction:column;gap:4px;min-width:0}
.ls2-current-language strong{font-size:15px}
.ls2-current-language small{font-size:9px;color:var(--mut)}
.ls2-select-label{display:block;font-size:10px;font-weight:700;color:var(--mut);margin:18px 0 7px}
.ls2-select{width:100%;min-height:40px;padding:0 11px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);color:var(--tx);font:inherit;font-size:12px}
.ls2-help{font-size:10px;line-height:1.55;color:var(--mut);margin:12px 0 0}
.ls2-library-panel{overflow:hidden}
.ls2-library-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:18px 19px 15px;border-bottom:1px solid var(--bd)}
.ls2-library-head h3{font-size:15px;letter-spacing:-.02em;margin:5px 0 4px}
.ls2-library-head p{font-size:10px;line-height:1.5;color:var(--mut);margin:0}
.ls2-count{display:flex;align-items:baseline;gap:4px;padding:7px 9px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);font-size:13px;font-weight:800;white-space:nowrap}
.ls2-count small{font-size:8px;font-weight:600;color:var(--mut)}
.ls2-language-list{padding:3px 18px}
.ls2-language-row{display:flex;align-items:center;gap:11px;padding:11px 1px;border-bottom:1px solid var(--bd);min-width:0}
.ls2-language-row:last-child{border-bottom:0}
.ls2-language-code{width:34px;height:34px;border-radius:8px;font-size:10px}
.ls2-language-title{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}
.ls2-language-title b{font-size:11px;font-weight:700}
.ls2-language-title small{font-size:9px;color:var(--mut)}
.ls2-default-tag{font-size:8px;letter-spacing:.08em;font-weight:800;color:var(--ac);padding:5px 7px;border-radius:5px;background:var(--tint);white-space:nowrap}
.ls2-remove{display:grid;place-items:center;width:28px;height:28px;flex:none;border:1px solid var(--bd);border-radius:7px;background:transparent;color:var(--mut);cursor:pointer}
.ls2-remove:hover{border-color:#c44;color:#c44;background:color-mix(in srgb,#c44 7%,transparent)}
.ls2-add-area{padding:14px 18px 17px;border-top:1px solid var(--bd);background:var(--bg)}
.ls2-add-title{display:flex;align-items:center;gap:9px;margin-bottom:11px}
.ls2-add-icon{display:grid;place-items:center;width:29px;height:29px;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--ac)}
.ls2-add-title>div{display:flex;flex-direction:column;gap:3px}
.ls2-add-title b{font-size:10px}
.ls2-add-title small{font-size:9px;color:var(--mut)}
.ls2-add-controls{display:flex;gap:8px}
.ls2-add-controls input{min-width:0;flex:1;height:38px;font-size:11px}
.ls2-add-controls button{height:38px;white-space:nowrap;font-size:10px}
.ls2-footnote{display:flex;align-items:flex-start;gap:7px;padding:10px 12px;border:1px solid var(--bd);border-radius:9px;color:var(--mut);font-size:9px;line-height:1.55;background:var(--bg)}
.ls2-footnote svg{flex:none;color:var(--ac)}
@media(max-width:760px){
 .language-settings-v2{gap:14px}
 .ls2-layout{grid-template-columns:1fr}
 .ls2-default-panel{padding:17px}
 .ls2-default-label{margin-top:16px}
 .ls2-library-head{padding:16px}
 .ls2-language-list{padding:2px 15px}
 .ls2-add-area{padding:13px 15px 15px}
}
@media(max-width:430px){
 .ls2-heading{gap:11px}
 .ls2-heading-mark{width:39px;height:39px}
 .ls2-heading h2{font-size:22px}
 .ls2-add-controls{flex-direction:column}
 .ls2-add-controls button{width:100%}
}


/* Simple, professional language settings */
.lang-clean{width:100%;max-width:820px;display:flex;flex-direction:column;gap:22px}
.lang-clean-head{padding:2px 0 17px;border-bottom:1px solid var(--bd)}
.lang-clean-head h2{font-size:22px;font-weight:700;letter-spacing:-.025em;margin:0 0 6px;color:var(--tx)}
.lang-clean-head p,.lang-clean-section-head p{font-size:12px;line-height:1.55;color:var(--mut);margin:0}
.lang-clean-section{padding:18px 0 0;border-top:1px solid var(--bd)}
.lang-clean-section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
.lang-clean-section-head h3{font-size:13px;font-weight:700;margin:0 0 5px;color:var(--tx)}
.lang-clean-count{display:grid;place-items:center;min-width:27px;height:27px;padding:0 7px;border:1px solid var(--bd);border-radius:7px;color:var(--mut);font-size:11px;font-weight:650}
.lang-clean-default-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px 13px;border:1px solid var(--bd);border-radius:8px;background:var(--card)}
.lang-clean-default-row label{font-size:12px;font-weight:600;color:var(--tx)}
.lang-clean-default-row select{width:min(260px,55%);min-height:36px;padding:0 10px;border:1px solid var(--bd);border-radius:6px;background:var(--bg);color:var(--tx);font:inherit;font-size:12px}
.lang-clean-list{border:1px solid var(--bd);border-radius:8px;background:var(--card);overflow:hidden}
.lang-clean-item{display:flex;align-items:center;gap:12px;min-height:49px;padding:9px 13px;border-bottom:1px solid var(--bd)}
.lang-clean-item:last-child{border-bottom:0}
.lang-clean-name{flex:1;min-width:0;font-size:12px;font-weight:600;color:var(--tx)}
.lang-clean-default{padding:4px 7px;border-radius:5px;background:var(--tint);color:var(--ac);font-size:9px;font-weight:700}
.lang-clean-remove{border:0;background:transparent;color:var(--mut);font:inherit;font-size:11px;padding:6px 2px;cursor:pointer}
.lang-clean-remove:hover{color:#c44;text-decoration:underline}
.lang-clean-add-row{display:flex;align-items:center;gap:8px}
.lang-clean-add-row input{flex:1;min-width:0;min-height:38px;font-size:12px}
.lang-clean-add-row button{min-height:38px;white-space:nowrap;font-size:11px}
.lang-clean-note{display:flex;align-items:flex-start;gap:7px;margin:0;color:var(--mut);font-size:10px;line-height:1.5}
.lang-clean-note svg{flex:none}
@media(max-width:560px){
 .lang-clean{gap:18px}
 .lang-clean-default-row{align-items:stretch;flex-direction:column;gap:8px}
 .lang-clean-default-row select{width:100%}
 .lang-clean-add-row{align-items:stretch;flex-direction:column}
 .lang-clean-add-row button{width:100%}
}


/* Apple-inspired Language settings: compact, restrained and native-feeling */
.apple-language-settings{width:100%;max-width:760px;display:flex;flex-direction:column;gap:25px;color:var(--tx)}
.als-heading{padding:2px 0 1px}
.als-heading h2{margin:0 0 5px;font-size:25px;line-height:1.2;font-weight:700;letter-spacing:-.045em;color:var(--tx)}
.als-heading p{margin:0;font-size:12px;line-height:1.5;color:var(--mut)}
.als-section{display:flex;flex-direction:column;gap:8px}
.als-section-title{display:flex;align-items:center;justify-content:space-between;padding:0 3px;font-size:9px;line-height:1.3;font-weight:750;letter-spacing:.09em;color:var(--mut)}
.als-section-title>span{font-size:9px;letter-spacing:0;font-weight:600}
.als-list{overflow:hidden;border:1px solid var(--bd);border-radius:10px;background:var(--card)}
.als-row{display:flex;align-items:center;justify-content:space-between;gap:15px;min-height:49px;padding:9px 14px;border-bottom:1px solid var(--bd);background:var(--card)}
.als-row:last-child{border-bottom:0}
.als-row-copy{display:flex;align-items:center;gap:9px;min-width:0;flex:1}
.als-row-copy strong{font-size:12px;line-height:1.4;font-weight:600;color:var(--tx)}
.als-default-note{font-size:9px;color:var(--ac);font-weight:650}
.als-default-row{border:1px solid var(--bd);border-radius:10px}
.als-default-row select{width:min(220px,48%);height:34px;padding:0 9px;border:1px solid var(--bd);border-radius:7px;background:var(--bg);color:var(--tx);font:inherit;font-size:11px}
.als-default-row .als-row-copy{display:flex;flex-direction:column;align-items:flex-start;gap:3px}
.als-default-row .als-row-copy span{font-size:10px;line-height:1.45;color:var(--mut)}
.als-remove{flex:none;padding:5px 2px;border:0;background:transparent;color:var(--mut);font:inherit;font-size:10px;cursor:pointer}
.als-remove:hover{color:#c44}
.als-add-section{padding-top:1px}
.als-add-row{display:flex;align-items:center;gap:8px}
.als-add-row input{height:36px;min-width:0;flex:1;font-size:11px}
.als-add-row button{height:36px;min-width:66px;font-size:11px}
.als-footnote{display:flex;align-items:flex-start;gap:6px;margin:0;color:var(--mut);font-size:9px;line-height:1.5}
.als-footnote svg{flex:none;opacity:.75}
@media(max-width:560px){
 .apple-language-settings{gap:21px}
 .als-heading h2{font-size:23px}
 .als-default-row{align-items:flex-start;flex-direction:column;gap:10px}
 .als-default-row select{width:100%}
 .als-row{padding:10px 12px}
}


/* Workspace polish */
.project-top{display:flex;align-items:center;gap:9px;flex-wrap:nowrap}
.project-top-title{display:flex;align-items:center;gap:8px;min-width:0}
.project-top-title h1{max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.top-mini-stats{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;min-width:0;overflow:hidden}
.top-mini-stats .chip{white-space:nowrap;padding:5px 7px;font-size:9px}
.mini-save-state{font-size:9px;color:var(--mut);white-space:nowrap}
.wr{display:grid;grid-template-columns:185px minmax(0,1fr);gap:15px;align-items:start}
.scene-nav-head{display:flex;align-items:center;justify-content:space-between;gap:7px;margin-bottom:8px}
.scene-nav-head h4{margin:0}
.scene-nav-toggle{width:29px;height:29px;flex:none}
.write-main{min-width:0}
.stk{position:sticky;top:0;z-index:30;background:var(--bg);padding:2px 0 8px}
.wbar{display:flex;align-items:center;gap:5px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin;padding:4px 0 8px}
.wbar .tools{display:flex;align-items:center;gap:3px;flex-wrap:nowrap;flex:none}
.wbar .type-tools{padding-right:6px;border-right:1px solid var(--bd)}
.wbar button{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:34px;padding:6px 8px;white-space:nowrap;font-size:10px}
.wbar button span{display:inline}
.wbar button kbd{font-size:8px;opacity:.5}
.wr.scenes-collapsed{grid-template-columns:34px minmax(0,1fr);gap:9px}
.wr.scenes-collapsed .nvp{overflow:hidden}
.wr.scenes-collapsed .scene-nav-head{justify-content:center}
.wr.scenes-collapsed .scene-nav-head h4,.wr.scenes-collapsed #nvl{display:none}
.wr.scenes-collapsed .scene-nav-toggle{transform:rotate(180deg)}
.page{max-width:1000px;margin:0 auto;min-height:75vh;padding:28px clamp(18px,4vw,64px);background:var(--card);border:1px solid var(--bd);border-radius:10px;box-shadow:none}
.wm{display:none!important}
@media(max-width:800px){
 .project-top{gap:5px;flex-wrap:wrap}
 .project-top-title{flex:1 1 auto;min-width:140px}
 .project-top-title h1{max-width:145px;font-size:15px}
 .top-mini-stats{order:6;flex:1 1 100%;overflow-x:auto}
 .wr,.wr.scenes-collapsed{grid-template-columns:1fr;gap:7px}
 .nvp{border:1px solid var(--bd);border-radius:8px;padding:7px 9px;background:var(--card)}
 .scene-nav-head{margin:0}
 .scene-nav-head h4{font-size:11px}
 .wr.scenes-collapsed .nvp{height:40px}
 .wr.scenes-collapsed .scene-nav-head h4{display:block}
 .wr.scenes-collapsed .scene-nav-toggle{transform:none}
 .wbar{gap:4px}
 .wbar button{min-height:35px;padding:6px 7px}
 .wbar button span,.wbar button kbd{display:none}
 .wbar>.tools.acts2{display:flex!important}
 .page{padding:18px 12px;min-height:68vh}
}
@media(max-width:460px){.project-top-title h1{max-width:110px}.project-top .pri{font-size:9px;padding:6px 7px}.top-mini-stats .chip{font-size:8px;padding:4px 5px}}
/* Screenplay details and cover thumbnail */
.details-workspace{max-width:1040px;display:flex;flex-direction:column;gap:16px}
.details-heading h2{font-size:23px;margin:0 0 5px;letter-spacing:-.035em}
.details-heading p{margin:0;color:var(--mut);font-size:12px}
.details-grid{display:grid;grid-template-columns:minmax(230px,.78fr) minmax(0,1.5fr);gap:13px;align-items:start}
.details-grid>.card{padding:17px;border-radius:11px}
.details-section-title{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
.details-section-title b{font-size:13px}
.details-section-title>span{font-size:8px;letter-spacing:.1em;color:var(--mut);font-weight:750}
.details-cover-preview{height:205px;border:1px dashed var(--bd);border-radius:8px;overflow:hidden;background:var(--bg);display:grid;place-items:center}
.details-cover-preview img{width:100%;height:100%;object-fit:cover}
.details-cover-placeholder{display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--mut)}
.details-cover-placeholder b{font-size:13px;color:var(--tx)}
.details-cover-placeholder small{font-size:10px}
.details-upload{display:flex;align-items:center;justify-content:center;min-height:36px;margin-top:11px;padding:8px;border:1px solid var(--bd);border-radius:7px;font-size:11px;font-weight:650;cursor:pointer;background:var(--bg)}
.details-upload input{display:none}
.details-remove-cover{width:100%;margin-top:6px;min-height:30px;border:0;background:transparent;color:var(--mut);font-size:10px}
.details-remove-cover:disabled{opacity:.35;cursor:not-allowed}
.details-cover-card>p{font-size:9px;line-height:1.5;margin:8px 0 0}
.details-meta-card>.fg{grid-template-columns:repeat(2,minmax(0,1fr))}
.details-language-title{padding-top:12px;margin:13px 0 5px;border-top:1px solid var(--bd)}
.details-meta-card>p{font-size:10px;margin:0 0 8px}
.scr-cover{position:relative;overflow:hidden}
.scr-cover-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
@media(max-width:720px){.details-grid{grid-template-columns:1fr}.details-cover-preview{height:175px}.details-meta-card>.fg{grid-template-columns:1fr}}
/* Schedule planner */
.schedule-workspace{max-width:1180px;display:flex;flex-direction:column;gap:15px}
.schedule-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:15px;flex-wrap:wrap}
.schedule-heading h2{font-size:24px;letter-spacing:-.04em;margin:5px 0}
.schedule-heading p{font-size:11px;color:var(--mut);margin:0;line-height:1.5}
.schedule-actions{display:flex;gap:6px;flex-wrap:wrap}
.schedule-actions button{min-height:33px;font-size:10px}
.schedule-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.schedule-summary>div{padding:12px 13px;border:1px solid var(--bd);border-radius:9px;background:var(--card);display:flex;flex-direction:column;gap:4px}
.schedule-summary b{font-size:20px;letter-spacing:-.04em}
.schedule-summary span{font-size:9px;color:var(--mut)}
.schedule-start{display:flex;align-items:center;gap:11px;padding:10px 12px;border:1px solid var(--bd);border-radius:8px;background:var(--bg)}
.schedule-start label{display:flex;align-items:center;gap:8px;font-size:10px;font-weight:650;white-space:nowrap}
.schedule-start input{min-height:32px}
.schedule-start>span{font-size:9px;color:var(--mut)}
.schedule-days{display:flex;flex-direction:column;gap:11px}
.schedule-day{padding:0!important;overflow:hidden;border-radius:11px}
.schedule-day-head{display:flex;align-items:center;gap:11px;flex-wrap:wrap;padding:13px 15px;border-bottom:1px solid var(--bd);background:var(--tint)}
.schedule-day-title{display:flex;align-items:center;gap:9px;min-width:175px;flex:1}
.schedule-day-number{display:grid;place-items:center;width:34px;height:34px;border:1px solid var(--bd);border-radius:8px;background:var(--card);font-size:11px;font-weight:800}
.schedule-day-title h3{font-size:12px;margin:0 0 3px}
.schedule-day-title p{font-size:9px;color:var(--mut);margin:0}
.schedule-day-metrics{display:flex;gap:5px;flex-wrap:wrap}
.schedule-day-metrics span{padding:5px 7px;border:1px solid var(--bd);border-radius:99px;background:var(--card);font-size:9px;color:var(--mut)}
.schedule-day-actions{display:flex;gap:4px}
.schedule-day-actions button{font-size:9px}
.schedule-day-fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;padding:12px 14px}
.schedule-day-fields label{font-size:9px;color:var(--mut);font-weight:650}
.schedule-day-fields input{margin-top:5px;min-width:0;width:100%;min-height:33px;font-size:10px}
.sch-table-wrap{padding:0 14px 13px;overflow-x:auto}
.sch-table-wrap table{width:100%;min-width:520px}
.sch-table-wrap td{font-size:10px}
.sch-table-wrap td small{display:block;color:var(--mut);font-size:9px;margin-top:3px}
.schedule-empty{padding:16px 14px;color:var(--mut);font-size:10px}
.schedule-unscheduled{border-style:dashed!important}
@media(max-width:700px){.schedule-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.schedule-day-fields{grid-template-columns:repeat(2,minmax(0,1fr))}.schedule-start{align-items:flex-start;flex-direction:column}.schedule-heading{align-items:flex-start}.schedule-actions{width:100%}}
@media(max-width:420px){.schedule-day-head{align-items:flex-start}.schedule-day-metrics{order:3;width:100%}.schedule-day-actions{margin-left:auto}.schedule-day-fields{grid-template-columns:1fr}}
/* Legal workspace */
.legal-home,.registration-workspace{max-width:1050px;display:flex;flex-direction:column;gap:16px}
.legal-intro h2,.legal-subhead h2,.legal-editor-head h2,.registration-intro h2{font-size:24px;letter-spacing:-.04em;margin:5px 0}
.legal-intro p,.legal-subhead p,.legal-editor-head p,.registration-intro>p{font-size:11px;color:var(--mut);line-height:1.6;margin:0}
.legal-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.legal-choice{display:flex;align-items:flex-start;gap:12px;min-height:140px;padding:17px;text-align:left;border:1px solid var(--bd);border-radius:12px;background:var(--card);color:var(--tx);transition:border-color .15s,transform .15s}
.legal-choice:hover,.legal-template-card:hover{border-color:var(--ac);transform:translateY(-2px)}
.legal-choice-icon,.legal-template-icon{display:grid;place-items:center;width:41px;height:41px;flex:none;border:1px solid var(--bd);border-radius:10px;background:var(--tint);color:var(--ac)}
.legal-choice>span:nth-child(2){display:flex;flex-direction:column;gap:6px;flex:1}
.legal-choice b{font-size:14px}
.legal-choice small{font-size:10px;line-height:1.5;color:var(--mut)}
.legal-choice em{font-size:9px;font-style:normal;color:var(--mut);white-space:nowrap}
.legal-choice em b{font-size:18px;margin-left:3px}
.legal-disclaimer{display:flex;gap:7px;align-items:flex-start;padding:10px 11px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);font-size:9px;line-height:1.5;color:var(--mut);margin:0}
.legal-disclaimer svg{flex:none}
.legal-back{padding:5px 0;border:0;background:transparent;color:var(--mut);font-size:10px;text-align:left}
.legal-back:hover{color:var(--ac)}
.legal-template-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.legal-template-card{display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-height:135px;padding:14px;border:1px solid var(--bd);border-radius:10px;background:var(--card);color:var(--tx);text-align:left;transition:.15s}
.legal-template-icon{width:35px;height:35px}
.legal-template-card>b{font-size:12px}
.legal-template-card>small{font-size:9px;line-height:1.45;color:var(--mut)}
.legal-template-open{font-size:9px;font-weight:700;color:var(--ac);margin-top:auto}
.legal-editor-head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap}
.legal-editor-head>button{font-size:10px}
.legal-editor-grid{display:grid;grid-template-columns:minmax(240px,.85fr) minmax(0,1.2fr);gap:12px;align-items:start}
.legal-fields{padding:15px!important}
.legal-fields h3,.legal-preview-head h3,.registration-how h3,.registration-records h3,.registration-official h3{font-size:13px;margin:0 0 5px}
.legal-fields .fg{grid-template-columns:1fr}
.legal-preview-section{min-width:0}
.legal-preview-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
.legal-preview-head p,.registration-records-head p{font-size:9px;color:var(--mut);margin:0}
.legal-preview-section .dpv{max-height:650px;overflow:auto;background:#fff;color:#202020;border:1px solid var(--bd);border-radius:8px;padding:20px;font:11px/1.6 Georgia,serif}
.legal-export-actions{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px}
.legal-export-actions button{font-size:9px;min-height:31px}
.registration-intro,.registration-how,.registration-records,.registration-official{padding:16px;border:1px solid var(--bd);border-radius:11px;background:var(--card)}
.registration-notice{display:flex;flex-direction:column;gap:5px;margin:13px 0;padding:11px;border:1px solid #c59a3b55;border-radius:8px;background:color-mix(in srgb,#c59a3b 7%,var(--card))}
.registration-notice b{font-size:10px}
.registration-notice span{font-size:9px;line-height:1.5;color:var(--mut)}
.registration-start{min-height:37px}
.registration-how ol{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;list-style:none;padding:0;margin:13px 0 0;counter-reset:reg}
.registration-how li{display:flex;flex-direction:column;gap:5px;padding:10px;border:1px solid var(--bd);border-radius:8px;counter-increment:reg}
.registration-how li:before{content:counter(reg,decimal-leading-zero);font-size:10px;font-weight:800;color:var(--ac)}
.registration-how li b{font-size:10px}
.registration-how li span{font-size:9px;line-height:1.45;color:var(--mut)}
.registration-records-head{margin-bottom:9px}
.registration-record{padding:12px 0;border-top:1px solid var(--bd)}
.registration-record-top{display:flex;justify-content:space-between;align-items:flex-start;gap:9px}
.registration-record-top>div{display:flex;flex-direction:column;gap:4px}
.registration-record-top b{font-size:11px}
.registration-record-top small{font-size:9px;color:var(--mut)}
.registration-record-id{font:9px ui-monospace,monospace;padding:5px 7px;border-radius:6px;background:var(--tint);color:var(--ac);white-space:nowrap}
.registration-record-hash{margin:8px 0;padding:8px;border-radius:6px;background:var(--bg);font:9px ui-monospace,monospace;word-break:break-all;color:var(--mut)}
.registration-empty{padding:15px;border:1px dashed var(--bd);border-radius:8px;color:var(--mut);font-size:10px}
.registration-official p{font-size:9px;line-height:1.5;color:var(--mut)}
.registration-official a{font-size:10px;color:var(--ac);font-weight:700}
.reg-progress{text-align:center;padding:23px 8px}
.reg-spinner{width:35px;height:35px;margin:0 auto 12px;border:3px solid var(--bd);border-top-color:var(--ac);border-radius:50%;animation:regspin .8s linear infinite}
@keyframes regspin{to{transform:rotate(360deg)}}
.reg-progress h3{font-size:15px;margin:0 0 6px}
.reg-progress p{font-size:10px;color:var(--mut)}
.reg-progress-steps{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin-top:15px}
.reg-progress-steps span{padding:6px 8px;border:1px solid var(--bd);border-radius:99px;font-size:8px;color:var(--mut)}
.reg-progress-steps .active{color:var(--ac);border-color:var(--ac)}
.reg-success{text-align:center;padding:18px 8px}
.reg-success-mark{display:grid;place-items:center;width:52px;height:52px;margin:0 auto 11px;border-radius:50%;background:var(--tint);color:var(--ac)}
.reg-success h2{font-size:20px;margin:7px 0}
.reg-success>p{font-size:10px;color:var(--mut);line-height:1.5}
.reg-id-label{font-size:8px;letter-spacing:.13em;color:var(--mut);margin-top:17px}
.reg-id-value{font:700 17px ui-monospace,monospace;letter-spacing:.04em;padding:12px;margin:8px auto;background:var(--tint);border-radius:8px;color:var(--ac)}
.reg-success-meta{font-size:9px;color:var(--mut)}
.reg-success .legal-disclaimer{margin-top:13px}
@media(max-width:760px){.legal-choice-grid,.legal-template-grid,.legal-editor-grid{grid-template-columns:1fr}.registration-how ol{grid-template-columns:repeat(2,minmax(0,1fr))}.legal-choice{min-height:115px}}
@media(max-width:450px){.registration-how ol{grid-template-columns:1fr}.registration-record-top{flex-direction:column}.legal-export-actions button{flex:1}}
/* Advanced PDF export */
.pdf-studio{max-width:1060px;display:flex;flex-direction:column;gap:14px}
.pdf-studio-head{display:flex;justify-content:space-between;align-items:flex-start;gap:14px}
.pdf-studio-head h2{font-size:23px;letter-spacing:-.04em;margin:5px 0}
.pdf-studio-head p{font-size:11px;line-height:1.5;color:var(--mut);margin:0}
.pdf-settings-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.pdf-option-card{display:flex;flex-direction:column;gap:9px;padding:15px;border:1px solid var(--bd);border-radius:10px;background:var(--card)}
.pdf-option-card h3{font-size:12px;margin:0 0 2px}
.pdf-check{display:flex;align-items:center;gap:8px;font-size:10px;color:var(--tx)}
.pdf-check input{width:15px;height:15px;margin:0;accent-color:var(--ac)}
.pdf-option-card>label:not(.pdf-check){font-size:10px;color:var(--mut);font-weight:650}
.pdf-option-card select,.pdf-option-card input:not([type=checkbox]){width:100%;min-height:33px;margin-top:5px;font-size:11px}
.pdf-two-fields{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pdf-section-control{grid-column:1/-1}
.pdf-section-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}
.pdf-security-note{display:flex;flex-direction:column;gap:6px;padding:10px;border:1px solid var(--bd);border-radius:8px;background:var(--bg)}
.pdf-security-note b{font-size:10px}
.pdf-security-note span{font-size:9px;line-height:1.5;color:var(--mut)}
.pdf-export-bottom{display:flex;align-items:center;justify-content:space-between;gap:11px;padding:13px;border:1px solid var(--bd);border-radius:9px;background:var(--tint)}
.pdf-export-bottom>div{display:flex;flex-direction:column;gap:4px}
.pdf-export-bottom b{font-size:11px}
.pdf-export-bottom small{font-size:9px;color:var(--mut)}
.pdf-export-bottom button{white-space:nowrap}
.pdf-other-formats{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.pdf-other-formats span{font-size:9px;color:var(--mut);margin-right:3px}
.pdf-other-formats button{font-size:9px;min-height:28px}
@media(max-width:650px){.pdf-settings-grid{grid-template-columns:1fr}.pdf-section-control{grid-column:auto}.pdf-section-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pdf-export-bottom{align-items:stretch;flex-direction:column}.pdf-export-bottom button{width:100%}}
/* Reports layout refinement */
.rw-page{max-width:1220px}
.rw-header{padding:22px 24px}
.rw-library-grid,.rw-analysis-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.rw-group{border-radius:11px}
.rw-report{min-height:54px}
@media(max-width:680px){.rw-library-grid,.rw-analysis-grid{grid-template-columns:1fr}}


@media(max-width:800px){
 .wbar{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;align-items:center!important}
 .wbar>.tools.type-tools{display:flex!important;grid-template-columns:none!important;flex:none!important;width:auto!important;max-width:none!important;overflow:visible!important;border-right:1px solid var(--bd)!important}
 .wbar>.tools.type-tools button{width:auto!important;min-width:34px!important;min-height:36px!important;padding:7px!important}
 .wbar>.tools.acts2{display:flex!important;flex:none!important;overflow:visible!important}
 .wbar>.tools.acts2 button{width:auto!important;min-width:34px!important;min-height:36px!important;padding:7px!important}
}


/* ==========================================================
   PINES STUDIO — PROFESSIONAL UI SYSTEM
   Clean production workspace / restrained pine accent
   ========================================================== */
:root{
 --bg:#f5f7f8;--card:#fff;--paper:#fff;--fg:#202b33;--mut:#74818a;
 --bd:#e2e7ea;--tint:#edf5f1;--dk:#183c31;--ac:#28765b;
 --mint:#dcebe4;--mint2:#c6dfd3;--on:#183c31;--nvc:#53616a;
 --topbg:#ffffffed;--sh:0 1px 2px #172b2410,0 8px 24px -18px #172b2440;
 --e:cubic-bezier(.2,.7,.2,1);
}
html[data-theme=dark]{
 --bg:#111719;--card:#182124;--paper:#182124;--fg:#e7eeec;--mut:#94a19f;
 --bd:#2b383b;--tint:#1e302b;--dk:#d5e9df;--ac:#73b99a;
 --mint:#294238;--mint2:#345747;--on:#e4f2eb;--nvc:#b3c0bd;
 --topbg:#151e20ed;--sh:0 1px 2px #0005,0 10px 26px -18px #000a;
}
html,body{background:var(--bg);color:var(--fg)}
body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,"Noto Sans Tamil",sans-serif;font-size:13px;line-height:1.55;background:var(--bg);letter-spacing:0}
button,input,select,textarea{font-family:inherit}
button{border-radius:8px;border:1px solid var(--bd);background:var(--card);color:var(--fg);padding:8px 11px;gap:7px;box-shadow:none;transition:background .15s,border-color .15s,color .15s,transform .15s}
button:hover{transform:none;box-shadow:none;border-color:color-mix(in srgb,var(--ac) 42%,var(--bd));background:var(--tint)}
button:active{transform:translateY(0)}
.pri{background:var(--ac);border-color:var(--ac);color:#fff;font-weight:650;box-shadow:none}
.pri:hover{background:color-mix(in srgb,var(--ac) 88%,#000);border-color:var(--ac);color:#fff}
input,select,textarea{background:var(--card);border:1px solid var(--bd);border-radius:8px;color:var(--fg);padding:9px 11px;box-shadow:none}
input:focus,select:focus,textarea:focus{border-color:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 13%,transparent);outline:0}
label{color:var(--mut);font-size:11px;font-weight:600}
.chip{background:var(--tint);border:1px solid var(--bd);border-radius:6px;color:var(--dk);font-size:10px;font-weight:650;padding:3px 7px}
.ib{border-radius:7px;padding:7px}
.dng{color:#bd514d}
#app{min-height:100vh;background:var(--bg)}
.sb{width:226px;padding:19px 12px 14px;gap:3px;background:var(--card);border-right:1px solid var(--bd);box-shadow:none}
.lg{padding:2px 9px 22px;gap:10px;font-size:19px;color:var(--fg)}
.lg b{font-weight:750;letter-spacing:-.045em}
.lgi{width:32px;height:32px;border-radius:9px;background:var(--tint);color:var(--ac);box-shadow:none}
.sb hr{border-color:var(--bd);margin:9px 3px}
.nv{min-height:37px;padding:8px 10px;border-radius:7px;color:var(--nvc);font-size:12px;font-weight:550;gap:10px}
.nv:hover{background:var(--bg);color:var(--fg)}
.nv.on{background:var(--tint);color:var(--dk);font-weight:700;box-shadow:inset 2px 0 0 var(--ac)!important}
.sbf{border-top:1px solid var(--bd);padding:13px 5px 2px;margin-top:auto}
.av{background:var(--tint);color:var(--dk);border:1px solid var(--bd);border-radius:50%}
.sbf b{font-size:11px;color:var(--fg)}
.sbf span{font-size:9px;color:var(--mut)}
.mn{min-width:0;background:var(--bg)}
.top{min-height:58px;padding:10px 26px;background:var(--topbg);border-bottom:1px solid var(--bd);backdrop-filter:blur(12px);gap:9px}
.top h1{font-size:15px;font-weight:700;letter-spacing:-.025em;color:var(--fg)}
.top select{min-height:34px;border-radius:7px;font-size:11px}
.top .pri{min-height:34px;font-size:11px}
.ct{max-width:1480px;padding:26px 30px 42px}
.ct>*{animation:fade .18s ease-out}
.hero{padding:23px 25px;border:1px solid var(--bd);border-radius:13px;background:var(--card);color:var(--fg);box-shadow:none}
.hero h2{font-size:22px;font-weight:720;letter-spacing:-.045em;margin-bottom:5px}
.hero p{font-size:12px;color:var(--mut);opacity:1}
.hero .pri{background:var(--ac);color:#fff;border-color:var(--ac)}
.st4{gap:10px;margin:17px 0 27px}
.stc{padding:14px 16px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none}
.stc b{font-size:23px;font-weight:730;letter-spacing:-.04em;color:var(--fg)}
.stc span{font-size:10px;color:var(--mut)}
.lib-head{margin:25px 0 12px}
.lib-head h3{font-size:16px;letter-spacing:-.025em}
.lib-head p{font-size:11px;color:var(--mut)}
.lib-tools{gap:8px;margin-bottom:13px}
.lib-tools input{max-width:420px}
.scr-grid{gap:13px}
.scr-card{border:1px solid var(--bd);border-radius:11px;box-shadow:none;background:var(--card);transition:border-color .15s,transform .15s}
.scr-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--ac) 40%,var(--bd));box-shadow:0 7px 18px #0000000a}
.scr-cover{background:var(--tint);min-height:145px}
.scr-cover .monogram{font-size:46px;font-weight:750;color:color-mix(in srgb,var(--ac) 65%,var(--mut))}
.scr-body{padding:14px}
.scr-title{font-size:14px;font-weight:700;letter-spacing:-.02em}
.scr-byline{font-size:10px;color:var(--mut)}
.scr-metrics{border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:10px 0;margin:12px 0}
.scr-metrics b{font-size:14px}
.scr-metrics span{font-size:9px;color:var(--mut)}
.scr-foot{padding-top:2px}
.scr-open{background:var(--tint);border-color:var(--bd);color:var(--dk);font-size:10px;font-weight:650}
.lib-empty{border:1px dashed var(--bd);border-radius:11px;background:var(--card)}
/* Write workspace */
.wr{gap:0;min-height:calc(100vh - 120px);border:1px solid var(--bd);border-radius:10px;background:var(--card);overflow:hidden}
.nvp{background:var(--card);border-right:1px solid var(--bd);padding:13px 10px}
.scene-nav-head{padding:3px 5px 11px;border-bottom:1px solid var(--bd);margin-bottom:7px}
.scene-nav-head h4{font-size:11px;font-weight:750;letter-spacing:.02em}
.scene-nav-toggle{border:0;background:transparent}
.write-main{min-width:0;background:var(--card);padding:0 0 22px}
.stk{position:sticky;top:58px;z-index:5;background:var(--card);border-bottom:1px solid var(--bd);padding:9px 14px 0}
.wbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin}
.tools{display:flex;align-items:center;gap:4px;flex-wrap:nowrap;white-space:nowrap}
.type-tools button,.acts2 button{height:32px;min-width:0;padding:5px 8px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--nvc);font-size:10px;box-shadow:none}
.type-tools button:hover,.acts2 button:hover{background:var(--bg);border-color:var(--bd);color:var(--fg)}
.type-tools button.on,.acts2 button.on{background:var(--tint);border-color:color-mix(in srgb,var(--ac) 22%,var(--bd));color:var(--dk)}
.type-tools kbd{font-size:8px;background:var(--bg);border:1px solid var(--bd);border-radius:3px;padding:0 3px;color:var(--mut)}
.sgb{padding:0 0 7px}
.page{max-width:790px;width:100%;margin:20px auto 10px;padding:34px 58px 54px;border:1px solid var(--bd);border-radius:3px;background:#fff;color:#222;box-shadow:0 4px 20px #172b240b}
.page .blk{font-family:"Courier Prime","Courier New",monospace}
.write-main>.mut{display:block;text-align:center;font-size:9px;color:var(--mut);padding:5px 15px}
/* Reports */
.rw-page{max-width:1190px;gap:22px;padding:0 0 28px}
.rw-header{padding:21px 23px;border:1px solid var(--bd);border-radius:11px;background:var(--card);box-shadow:none}
.rw-header:after{display:none}
.rw-header h1{font-size:29px;font-weight:760;letter-spacing:-.055em}
.rw-header>div:first-child>p{font-size:11px;color:var(--mut)}
.rw-project{border:1px solid var(--bd);border-left:2px solid var(--ac);border-radius:8px;box-shadow:none;padding:11px 13px;background:var(--bg)}
.rw-overview{gap:12px}
.rw-overview-main,.rw-budget-panel{border-radius:10px;box-shadow:none}
.rw-overview-main{border:1px solid var(--bd);padding:19px}
.rw-overview-main h2,.rw-section-heading h2{font-size:18px;font-weight:720;letter-spacing:-.035em}
.rw-stats{gap:8px}
.rw-stat{border-radius:8px;padding:11px;background:var(--bg);box-shadow:none}
.rw-stat strong{font-size:21px}
.rw-budget-panel{background:var(--dk);border:1px solid var(--dk);padding:19px}
.rw-budget-panel:after{display:none}
.rw-budget-value{font-size:27px}
.rw-analysis-grid{gap:10px}
.rw-analysis-card,.rw-group{border-radius:9px;box-shadow:none}
.rw-analysis-card{padding:14px;min-height:135px}
.rw-analysis-card:hover,.rw-group:hover{transform:none;box-shadow:none}
.rw-group-head{padding:14px;background:var(--bg)}
.rw-group-head>span{border-radius:7px}
.rw-report{padding:10px 2px}
.rw-report:hover{padding-left:5px;padding-right:5px;transform:none}
.rw-report-icon{border-radius:7px}
.rw-attention{border-radius:9px}
/* Schedule */
.schedule-workspace{max-width:1190px;gap:16px}
.schedule-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:3px 0 17px;border-bottom:1px solid var(--bd)}
.schedule-heading h2{font-size:24px;letter-spacing:-.045em;font-weight:750;margin:5px 0}
.schedule-heading p{font-size:11px;color:var(--mut);margin:0}
.schedule-actions{display:flex;flex-wrap:wrap;gap:7px}
.schedule-actions button{font-size:10px}
.schedule-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
.schedule-summary>div{padding:13px 15px;border:1px solid var(--bd);border-radius:9px;background:var(--card)}
.schedule-summary b{font-size:21px;letter-spacing:-.04em}
.schedule-summary span{font-size:10px;color:var(--mut)}
.schedule-start{display:flex;align-items:center;gap:15px;padding:12px 14px;border:1px solid var(--bd);border-radius:9px;background:var(--card)}
.schedule-start label{margin:0;display:flex;align-items:center;gap:10px}
.schedule-start input{width:auto;min-width:145px}
.schedule-start>span{font-size:10px;color:var(--mut)}
.schedule-days{gap:12px}
.schedule-day{border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none;padding:0;overflow:hidden}
.schedule-day-head{padding:14px 16px;border-bottom:1px solid var(--bd);gap:12px}
.schedule-day-number{background:var(--tint);border:1px solid var(--bd);color:var(--dk);border-radius:7px}
.schedule-day-title h3{font-size:13px;font-weight:700}
.schedule-day-title p{font-size:10px;color:var(--mut)}
.schedule-day-metrics span{font-size:9px;border:1px solid var(--bd);background:var(--bg);border-radius:5px;padding:4px 7px}
.schedule-day-fields{padding:12px 16px;gap:10px}
.schedule-day-fields label{margin:0;font-size:10px}
.schedule-day-fields input{margin-top:5px;font-size:11px}
.sch-table-wrap{padding:0 16px 14px;overflow-x:auto}
.sch-table-wrap table{min-width:600px;border-collapse:collapse}
.sch-table-wrap th{background:var(--bg);color:var(--mut);font-size:9px;text-transform:uppercase;letter-spacing:.06em}
.sch-table-wrap td,.sch-table-wrap th{padding:9px 10px;border-bottom:1px solid var(--bd);font-size:10px;text-align:left}
.sch-table-wrap td small{display:block;color:var(--mut);font-size:9px}
.sch-table-wrap tr:hover td{background:var(--bg)}
/* Legal workspace */
.legal-home,.legal-subhead,.legal-editor-head,.registration-workspace{max-width:1120px}
.legal-intro{padding:0 0 17px;border-bottom:1px solid var(--bd)}
.legal-intro h2,.legal-subhead h2,.legal-editor-head h2{font-size:25px;font-weight:750;letter-spacing:-.045em;margin:5px 0}
.legal-intro p,.legal-subhead p,.legal-editor-head p{font-size:11px;color:var(--mut)}
.legal-choice-grid{gap:12px;margin:17px 0}
.legal-choice{min-height:118px;padding:17px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none;display:grid;grid-template-columns:40px 1fr auto;align-items:center;text-align:left}
.legal-choice:hover{background:var(--card);border-color:color-mix(in srgb,var(--ac) 42%,var(--bd))}
.legal-choice-icon,.legal-template-icon{width:36px;height:36px;border-radius:8px;background:var(--tint);color:var(--ac)}
.legal-choice b{font-size:13px}
.legal-choice small{font-size:10px;color:var(--mut)}
.legal-choice em{font-size:10px;color:var(--ac);font-style:normal}
.legal-disclaimer{font-size:10px;color:var(--mut);line-height:1.6}
.legal-back{border:0;background:transparent;color:var(--ac);padding:4px 0;margin-bottom:15px;font-size:11px}
.legal-template-grid{gap:10px}
.legal-template-card{min-height:150px;padding:16px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none;text-align:left;align-items:flex-start}
.legal-template-card b{font-size:12px}
.legal-template-card small{font-size:10px;color:var(--mut)}
.legal-template-open{font-size:10px;color:var(--ac)}
.legal-editor-grid{gap:15px}
.legal-fields,.legal-preview-section{border:1px solid var(--bd);border-radius:10px;box-shadow:none;background:var(--card);padding:17px}
.legal-fields h3,.legal-preview-head h3{font-size:13px;font-weight:700}
.legal-fields .fg{gap:9px}
.legal-fields label{font-size:10px}
.legal-fields input,.legal-fields select{font-size:11px}
.legal-preview-head{padding-bottom:10px;border-bottom:1px solid var(--bd)}
.dpv{margin:14px auto;padding:30px 26px;max-width:600px;min-height:450px;border:1px solid var(--bd);box-shadow:0 2px 12px #00000008}
.legal-export-actions{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.legal-export-actions button{font-size:10px}
/* Registration flow */
.registration-workspace{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:13px}
.registration-intro,.registration-how,.registration-records{padding:18px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none}
.registration-intro h2{font-size:23px;letter-spacing:-.04em;margin:5px 0}
.registration-intro>p,.registration-notice span{font-size:11px;color:var(--mut);line-height:1.6}
.registration-notice{padding:12px;border:1px solid var(--bd);border-radius:8px;background:var(--bg);margin:13px 0}
.registration-notice b{font-size:11px}
.registration-how h3,.registration-records h3{font-size:13px}
.registration-how li{padding:7px 0;font-size:11px}
.registration-how li span{display:block;color:var(--mut);font-size:10px}
.registration-records{grid-column:1/-1}
.registration-record{padding:12px 0;border-bottom:1px solid var(--bd)}
/* Export studio */
.pdf-studio{max-width:1100px;gap:13px}
.pdf-studio-head{padding:0 0 17px;border-bottom:1px solid var(--bd)}
.pdf-studio-head h2{font-size:24px;letter-spacing:-.04em;font-weight:750;margin:5px 0}
.pdf-studio-head p{font-size:11px;color:var(--mut)}
.pdf-settings-grid{gap:11px}
.pdf-option-card{padding:17px;border:1px solid var(--bd);border-radius:10px;background:var(--card);box-shadow:none}
.pdf-option-card h3{font-size:12px;font-weight:750;border-bottom:1px solid var(--bd);padding-bottom:10px;margin:0 0 10px}
.pdf-option-card label{font-size:10px}
.pdf-option-card input,.pdf-option-card select{font-size:11px}
.pdf-export-bottom{border:1px solid var(--bd);border-radius:10px;background:var(--card);padding:14px 16px}
.pdf-export-bottom b{font-size:12px}
.pdf-export-bottom small{font-size:10px;color:var(--mut)}
/* General content cards / details / settings */
.card,.sec{border:1px solid var(--bd);border-radius:10px;box-shadow:none;background:var(--card)}
.tabs{gap:5px;border-bottom:1px solid var(--bd);padding-bottom:8px}
.tabs button{border-radius:7px;font-size:11px}
.tabs button.on{background:var(--tint);color:var(--dk);border-color:var(--bd);box-shadow:none}
.sec h3,.card h3{font-size:13px;font-weight:700}
table{border-collapse:collapse}
th{font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:var(--mut);background:var(--bg)}
td{font-size:11px;border-color:var(--bd)}
tr:hover td{background:var(--bg)}
/* Mobile and tablet */
@media(max-width:900px){
 .sb{width:205px}
 .ct{padding:21px 18px 34px}
 .top{padding:10px 17px}
 .page{padding:28px 34px}
 .registration-workspace{grid-template-columns:1fr}
 .registration-records{grid-column:auto}
}
@media(max-width:680px){
 #app{display:block}
 .sb{position:sticky;top:0;z-index:20;width:100%;height:auto;min-height:0;flex-direction:row;align-items:center;overflow-x:auto;padding:7px 9px;border-right:0;border-bottom:1px solid var(--bd);gap:5px}
 .lg{padding:0 8px 0 2px;font-size:15px;flex:none}
 .lgi{width:28px;height:28px}
 .sb hr{display:none}
 .nv{width:auto;min-width:max-content;min-height:34px;padding:7px 9px;gap:6px;font-size:10px}
 .nv .ic{width:14px;height:14px}
 .sbf{display:none}
 .mn{width:100%}
 .top{position:sticky;top:48px;min-height:52px;padding:8px 12px;gap:7px}
 .top h1{font-size:13px}
 .ct{padding:15px 12px 28px}
 .hero{padding:17px;border-radius:10px}
 .hero h2{font-size:19px}
 .st4{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 .stc{padding:11px}
 .stc b{font-size:20px}
 .lib-head{align-items:flex-start}
 .lib-tools{display:grid;grid-template-columns:1fr 1fr}
 .lib-tools input{grid-column:1/-1;max-width:none}
 .scr-grid{grid-template-columns:1fr}
 .wr{min-height:calc(100vh - 120px)}
 .nvp{width:190px;max-width:45vw}
 .stk{top:52px;padding:7px 8px 0}
 .wbar{justify-content:flex-start;gap:8px}
 .type-tools button,.acts2 button{height:31px;padding:5px 7px;font-size:9px}
 .type-tools kbd{display:none}
 .page{margin:13px auto 8px;padding:23px 18px 35px;width:calc(100% - 18px);font-size:12px}
 .schedule-heading{flex-direction:column}
 .schedule-actions{width:100%}
 .schedule-summary{grid-template-columns:repeat(2,minmax(0,1fr))}
 .schedule-start{align-items:flex-start;flex-direction:column}
 .schedule-start label{align-items:flex-start;flex-direction:column}
 .schedule-day-head{flex-wrap:wrap}
 .schedule-day-fields{grid-template-columns:1fr 1fr}
 .legal-choice-grid,.legal-template-grid{grid-template-columns:1fr}
 .legal-choice{min-height:94px}
 .legal-editor-grid{grid-template-columns:1fr}
 .pdf-settings-grid{grid-template-columns:1fr}
 .rw-header{flex-direction:column;align-items:flex-start}
 .rw-project{width:100%}
}
@media(prefers-reduced-motion:reduce){
 *,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}
}

</style></head><body><h2>${esc(s.title)} – ${rtab}</h2>${tbl(reps(s)[rtab])}</body></html>`)},
rcsv:()=>{const s=cur();dl(fn(s)+'_'+rtab.replace(/\s/g,'_')+'.csv','text/csv',csv(reps(s)[rtab]))},
addl:()=>{const v=$('#nl').value.trim();if(v&&!S.langs.includes(v)){S.langs.push(v);save();rr()}},
rml:i=>{S.scripts.forEach(s=>{if(s.lang==i)s.lang=S.langs.find(l=>l!=i)});S.langs=S.langs.filter(l=>l!=i);if(S.set.defLang==i)S.set.defLang=S.langs[0];save();rr()}
});
