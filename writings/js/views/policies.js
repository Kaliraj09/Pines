/* ============================================================
   Pines · views/policies.js
   Terms & Conditions and Privacy Policy (popup readers)
   Opened from Settings → About. No separate page.
   ============================================================ */
(function(){
 /* ---- edit these if details change ---- */
 const POL_DATE='16 November 2026',
       POL_MAIL='info@pines.kalireads.in',
       POL_SITE='pines.kalireads.in';

 /* ---- popup styles (injected once) ---- */
 if(!document.getElementById('pol-css')){
  const st=document.createElement('style');st.id='pol-css';
  st.textContent=`
.md:has(.pol-doc){max-width:min(720px,96vw)}
.pol-doc{display:flex;flex-direction:column;gap:2px}
.pol-doc .pol-tag{font-size:10px;font-weight:700;letter-spacing:.12em;color:var(--ac)}
.pol-doc h3{margin:4px 0 2px}
.pol-doc .pol-date{font-size:11px;color:var(--mut);margin:0 0 10px}
.pol-doc .pol-sum{padding:10px 12px;border:1px solid var(--bd);border-radius:10px;background:var(--tint);font-size:12px;line-height:1.6;margin:0 0 6px}
.pol-doc h4{font-size:13px;margin:16px 0 4px}
.pol-doc p,.pol-doc li{font-size:12.5px;line-height:1.7;margin:0 0 6px}
.pol-doc ul{margin:0 0 6px;padding-left:18px}
.pol-doc a{color:var(--ac);text-decoration:underline;word-break:break-all}
.pol-doc .pol-sw{margin-top:14px;font-size:11px;color:var(--mut)}
`;
  document.head.appendChild(st);
 }

 const L=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
 const mail=`<a href="mailto:${POL_MAIL}">${POL_MAIL}</a>`;
 const site=`<a href="https://${POL_SITE}" target="_blank" rel="noopener">${POL_SITE}</a>`;

 /* ---- TERMS & CONDITIONS ---- */
 const TERMS=`
<div class="pol-doc">
 <div class="pol-tag">LEGAL</div>
 <h3>Terms &amp; Conditions</h3>
 <p class="pol-date">Pines Studios · Last updated ${POL_DATE}</p>
 <p class="pol-sum"><b>In short:</b> Pines is a screenwriting tool. Your screenplays belong to you and stay on your device. Please keep your own backups, and use the contract templates and script records as helpful tools, not as legal advice.</p>

 <h4>1. Acceptance of these terms</h4>
 <p>By opening or using Pines (the “App”), you agree to these Terms &amp; Conditions. If you do not agree, please do not use the App. Pines is provided by Pines Studios (“we”, “us”).</p>

 <h4>2. What Pines is</h4>
 <p>Pines is a screenplay writing and production-planning app that runs in your browser or as an installed app. It includes a script editor, project tools (characters, schedule, budget, reports, pitch deck and similar), a script library, backup and transfer tools, and legal-document and script-record helpers.</p>

 <h4>3. Your screenplays and content</h4>
 ${L([
  'You own everything you write in Pines. We do not claim any rights over your screenplays, notes, characters or other content.',
  'Your content is stored on your own device. We do not receive a copy of it, and we cannot recover it if it is lost.',
  'You are responsible for the content you create and for having the right to use any text, images or material you add.'
 ])}

 <h4>4. Backups and data loss</h4>
 <p>Because your work lives in your browser or device storage, it can be lost if you clear site data, uninstall the app, use private browsing, reset your device, or if the browser removes storage. Pines offers daily snapshots, export and import, and optional scheduled backups, but these are tools for you to use. Please download backups regularly and keep them somewhere safe. We are not responsible for lost or corrupted data.</p>

 <h4>5. Script library</h4>
 <p>The built-in library contains sample screenplays provided for reading, learning and practice. Source works that are in the public domain remain so. Please check the rights status of any work before you publish, perform or film it.</p>

 <h4>6. Contract templates (Legal workspace)</h4>
 <p>The writer agreement, NDA, location release and actor release are general starting templates only. They are <b>not legal advice</b> and may not suit your situation or your local law. Please have an advocate or legal professional review any agreement before you sign or rely on it. Using a template does not create a lawyer–client relationship with us.</p>

 <h4>7. Script registration records and certificates</h4>
 <p>A Pines registration record is a dated record containing a SHA-256 fingerprint of a script version, stored on your device. It is supporting evidence only. It is <b>not an official copyright registration</b>, filing or approval, and it does not by itself prove ownership or authorship. For official copyright registration, please use the process of the copyright office in your country. A record may be marked expired if the script is edited after registration.</p>

 <h4>8. Security features</h4>
 <p>Features such as the PIN lock, auto-lock and screenshot watermark are provided to help protect your work, but no feature can guarantee complete security. Keep your PIN safe. If you forget it, we may not be able to restore access to locked data. Transfer codes are valid for a short time and should be shared only with yourself or someone you trust.</p>

 <h4>9. Acceptable use</h4>
 ${L([
  'Do not use Pines for anything unlawful, or to infringe the rights of others.',
  'Do not try to copy, resell, reverse-engineer or interfere with the App or its source, except as the law allows.',
  'Do not misuse certificates or records to mislead others about authorship, registration or ownership.'
 ])}

 <h4>10. Intellectual property in the App</h4>
 <p>The Pines name, logo, design, code and the original text of the App belong to Pines Studios or its licensors. These terms give you a personal, non-exclusive, non-transferable right to use the App. They do not transfer any ownership of the App to you.</p>

 <h4>11. Third-party services</h4>
 <p>Some optional features rely on third parties, such as Google Fonts, an optional Google Drive backup that you connect yourself, and a 3D library for the Visualize feature. Their own terms and privacy policies apply when you use them. We are not responsible for third-party services.</p>

 <h4>12. Availability and changes</h4>
 <p>We may update, add, change or remove features at any time, and may release new versions. The roadmap shows plans only, not promises of any feature or date.</p>

 <h4>13. Disclaimer of warranties</h4>
 <p>Pines is provided “as is” and “as available”, without warranties of any kind, whether express or implied, including fitness for a particular purpose, uninterrupted use or error-free operation. Page counts, runtime, budget and schedule figures are estimates to help your planning.</p>

 <h4>14. Limitation of liability</h4>
 <p>To the fullest extent the law allows, Pines Studios is not liable for any indirect, incidental or consequential loss, including loss of data, loss of work, or loss of profit arising from your use of, or inability to use, the App. Nothing in these terms limits any right you have under law that cannot be limited.</p>

 <h4>15. Changes to these terms</h4>
 <p>We may update these terms from time to time. The “last updated” date above shows the latest version. Continuing to use Pines after a change means you accept the updated terms.</p>

 <h4>16. Governing law</h4>
 <p>These terms are governed by the laws of India. Any dispute is subject to the courts of competent jurisdiction in India, unless your local law requires otherwise.</p>

 <h4>17. Contact</h4>
 <p>Questions about these terms? Write to ${mail} or visit ${site}.</p>
</div>`;

 /* ---- PRIVACY POLICY ---- */
 const PRIVACY=`
<div class="pol-doc">
 <div class="pol-tag">PRIVACY</div>
 <h3>Privacy Policy</h3>
 <p class="pol-date">Pines Studios · Last updated ${POL_DATE}</p>
 <p class="pol-sum"><b>In short:</b> Pines keeps your screenplays on your own device. We do not run accounts, we do not use analytics or ads, and we do not collect or sell your writing.</p>

 <h4>1. Who we are</h4>
 <p>Pines is made by Pines Studios. This policy explains what happens to information when you use the Pines screenwriting app. Contact: ${mail} · ${site}.</p>

 <h4>2. What stays on your device</h4>
 <p>Pines works locally. The following is stored in your browser or app storage (local storage and IndexedDB) on your device only:</p>
 ${L([
  'Your screenplays, versions and history, characters, schedules, budgets, notes and reports.',
  'Your settings, such as display name, theme, languages and defaults.',
  'Script registration records and certificate details (title, writer name, date, version and SHA-256 fingerprint).',
  'Daily backup snapshots and, if you turn it on, scheduled backup history.',
  'Your PIN lock, kept as a salted hash. The PIN itself is not stored.',
  'A copy of the app files, kept by the service worker so Pines works offline.'
 ])}
 <p>We do not receive, view or store this information on any server of ours.</p>

 <h4>3. What we do not collect</h4>
 ${L([
  'No sign-up, login or user account is needed.',
  'No analytics, tracking pixels, advertising or behaviour profiling.',
  'Pines does not need cookies. If any cookies exist for the site, you can clear them from Settings → Privacy &amp; data.',
  'We do not sell or rent any information.'
 ])}

 <h4>4. Optional features that connect to other services</h4>
 <p>Some features reach other services only when you use them:</p>
 ${L([
  '<b>Google Fonts:</b> the app loads fonts from Google Fonts. Google may receive technical information such as your IP address when the fonts load, under Google’s own privacy policy.',
  '<b>3D library (Visualize):</b> the Visualize feature may load a 3D library from a public content delivery network (cdnjs). The network may see technical request data such as your IP address.',
  '<b>Google Drive backup (optional):</b> if you connect Google Drive for scheduled backups, you sign in to Google with your own client ID and backup files are sent to your own Drive. We do not receive them.',
  '<b>Device transfer (optional, where available):</b> your workspace is encrypted on your device with a one-time code before it is sent. It is meant to be deleted after a successful transfer or when the code expires after about 5 minutes. Without the code, the data cannot be read.'
 ])}

 <h4>5. Exports, sharing and email</h4>
 <p>When you export, print, download or email a screenplay, report, pitch deck, contract or certificate, the file is created on your device and goes where you send it. Once a file leaves Pines, its privacy depends on where you share it. Features that open your email app only prepare a message for you to review and send.</p>

 <h4>6. Security</h4>
 <p>Your data stays on your device, so its safety depends largely on your device. Use a device passcode, turn on the Pines PIN lock and auto-lock, and keep backups. Device transfer uses strong encryption (AES-GCM with a key derived from your code). The optional screenshot watermark can help discourage unauthorised sharing, but it cannot prevent it.</p>

 <h4>7. Your choices and control</h4>
 ${L([
  'Export or back up all your data at any time from Settings → Backup.',
  'Delete individual screenplays inside the app.',
  'Remove everything Pines stores by clearing site data for Pines in your browser, or by using the erase options in Settings → Privacy &amp; data.',
  'Turn off daily snapshots, scheduled backups and cookie clearing in Settings as you prefer.'
 ])}
 <p>Because we do not hold your content, deleting it from your device removes it. We cannot delete or recover data we never received.</p>

 <h4>8. Children</h4>
 <p>Pines is a general writing tool and is not directed at young children. If you are under 18, please use it with the guidance of a parent or guardian.</p>

 <h4>9. Changes to this policy</h4>
 <p>We may update this policy as Pines grows, for example when new features such as cloud backup or collaboration arrive. If those features change how data is handled, this policy will be updated before they launch. The “last updated” date above shows the latest version.</p>

 <h4>10. Contact us</h4>
 <p>For any privacy question or request, write to ${mail} or visit ${site}.</p>
</div>`;

 /* ---- actions (opened from Settings → About) ---- */
 Object.assign(A,{
  polTerms:()=>modal(TERMS),
  polPrivacy:()=>modal(PRIVACY)
 });
})();
