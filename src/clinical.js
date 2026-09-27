// ACG 2021 Table 2. BUN is mg/dL, not total urea.
export const flags = [['melena', '黑便（melena）', 1], ['syncope', '暈厥（syncope）', 2], ['hepatic', '肝臟疾病', 2], ['failure', '心臟衰竭', 2]];
export const emptyGBS = {sex:'',bun:'',hb:'',sbp:'',hr:'',melena:'',syncope:'',hepatic:'',failure:''};
export const numeric = value => value !== '' && value !== null && value !== undefined && typeof value !== 'boolean' && String(value).trim() !== '' && Number.isFinite(Number(value));
export function calculateGBS(v) {
  const missing = Object.keys(emptyGBS).filter(k => v[k] === '' || v[k] === undefined || v[k] === null);
  const errors = {};
  for (const [key,label,min,max] of [['bun','BUN',0,500],['hb','Hb',0.1,30],['sbp','SBP',1,300],['hr','HR',1,300]]) {
    if (!missing.includes(key) && (!numeric(v[key]) || +v[key]<min || +v[key]>max)) errors[key]=`${label} 請輸入 ${min}–${max} 之間的數值，並確認單位。`;
  }
  if (!missing.includes('sex') && !['male','female'].includes(v.sex)) errors.sex='請選擇原始評分採用的性別。';
  for (const [key] of flags) if (!missing.includes(key) && !['yes','no'].includes(v[key])) errors[key]='請明確選擇是或否。';
  if (missing.length || Object.keys(errors).length) return {total:null, missing, errors,parts:[]};
  const bun=+v.bun,hb=+v.hb,sbp=+v.sbp,hr=+v.hr;
  const parts=[['BUN',bun>=70?6:bun>=28?4:bun>=22.4?3:bun>=18.2?2:0],['Hb',hb<10?6:v.sex==='male'?(hb<12?3:hb<13?1:0):(hb<12?1:0)],['SBP',sbp<90?3:sbp<100?2:sbp<110?1:0],['HR',hr>=100?1:0],...flags.map(([k,l,p])=>[l,v[k]==='yes'?p:0])];
  return {total:parts.reduce((n,[,p])=>n+p,0),parts,errors,missing:[],unstable:sbp<90};
}
export function transfusionAdvice(hb,context) {
  if (!numeric(hb) || +hb<=0 || +hb>30 || !['stable','cv','acute','variceal'].includes(context)) return null;
  if(context==='acute') return {title:'立即個別化評估',text:'ACS、休克或持續大量失血：不能等待 Hb 降至 7 g/dL 才處置。同步復甦、控制出血，依灌流、缺血與動態失血情形，由臨床團隊決定輸血。急性出血初期 Hb 可能尚未下降。'};
  if(context==='cv') return {title:+hb<=8?'達 ESGE 心血管疾病情境參考閾值':'尚未達參考閾值，持續評估',text:'穩定且有急性或慢性心血管疾病病史：ESGE 2021 採 Hb ≤8 g/dL 的較寬鬆閾值，提出輸後 ≥10 g/dL 目標（低品質證據）。此歷史指南目標須個別化；ACS 請改選急性情境並依當時心臟科指引。'};
  return {title:+hb<=7?'約達限制性輸血參考閾值':'Hb 高於一般限制性參考閾值',text:context==='variceal'?'靜脈曲張出血採保守輸血；Baveno VII 目標 Hb 7–8 g/dL，依持續失血、灌流、年齡與心血管疾病調整，避免過度輸血。':'一般穩定 UGIB：ACG 2021 約 7 g/dL；ESGE 2021 無心血管病史者 Hb ≤7 g/dL 時考慮輸血，輸後目標 7–9 g/dL。數值不能單獨決定是否輸血。'};
}
export function tipsAdvice(child,active,hvpg) {
  if (child!=='' && (!numeric(child) || !Number.isInteger(+child) || +child<5 || +child>15)) return {kind:'invalid',text:'Child–Pugh 總分須為 5–15 的整數。'};
  if (hvpg!=='' && (!numeric(hvpg)||+hvpg<0||+hvpg>80)) return {kind:'invalid',text:'HVPG 請輸入 0–80 mmHg，未知可留白。'};
  if(+child>=14) return {kind:'special',text:'Child–Pugh 14–15：不屬一般 pre-emptive TIPS 選擇條件。需肝臟／介入／移植團隊個別評估效益與無效治療風險；不能由本工具自動排除救援治療。'};
  if((+child>=10&&+child<=13)||(+child>=8&&+child<=9&&active==='yes')||(hvpg!==''&&+hvpg>20)) return {kind:'eligible',text:'符合至少一項高風險條件：立即聯絡肝臟與介入團隊評估 pre-emptive TIPS。此為轉介提示，仍須確認出血型態、禁忌與整體適應性。'};
  if(child==='' || (active==='' && +child>=8 && +child<=9)) return {kind:'incomplete',text:'資料不足，無法排除高風險。請完成 Child–Pugh 與必要的內視鏡出血資訊；HVPG 未測量可留白。'};
  return {kind:'not-met',text:'已填資料未符合所列條件；HVPG 未測量不代表正常。本結果不是低風險或不需 TIPS 的判定。若止血失敗，依救援流程處理。'};
}
