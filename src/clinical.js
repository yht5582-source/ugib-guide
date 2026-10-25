// Pure clinical logic (no React) so it can be unit-tested with `node --test`.

// ACG 2021 Table 2. BUN is mg/dL, not total urea.
export const flags = [
  ['melena', '黑便（melena）', 1],
  ['syncope', '暈厥（syncope）', 2],
  ['hepatic', '肝臟疾病', 2],
  ['failure', '心臟衰竭', 2],
];

export const emptyGBS = { sex: '', bun: '', hb: '', sbp: '', hr: '', melena: '', syncope: '', hepatic: '', failure: '' };

export const gbsLabels = {
  sex: '性別', bun: 'BUN', hb: 'Hb', sbp: 'SBP', hr: 'HR',
  melena: '黑便', syncope: '暈厥', hepatic: '肝臟疾病', failure: '心臟衰竭',
};

// Input sanity ranges guard against typos only; they are not physiological safe limits.
export const gbsRanges = [
  ['bun', 'BUN', 0, 500],
  ['hb', 'Hb', 0.1, 30],
  ['sbp', 'SBP', 1, 300],
  ['hr', 'HR', 1, 300],
];

export const numeric = value =>
  value !== '' && value !== null && value !== undefined && typeof value !== 'boolean' &&
  String(value).trim() !== '' && Number.isFinite(Number(value));

const isBlank = value => value === '' || value === undefined || value === null;

export function calculateGBS(v) {
  const missing = Object.keys(emptyGBS).filter(k => isBlank(v[k]));
  const errors = {};
  for (const [key, label, min, max] of gbsRanges) {
    if (!missing.includes(key) && (!numeric(v[key]) || +v[key] < min || +v[key] > max)) {
      errors[key] = `${label} 請輸入 ${min}–${max} 之間的數值，並確認單位。`;
    }
  }
  if (!missing.includes('sex') && !['male', 'female'].includes(v.sex)) errors.sex = '請選擇原始評分採用的性別。';
  for (const [key] of flags) {
    if (!missing.includes(key) && !['yes', 'no'].includes(v[key])) errors[key] = '請明確選擇是或否。';
  }
  if (missing.length || Object.keys(errors).length) return { total: null, missing, errors, parts: [] };

  const bun = +v.bun, hb = +v.hb, sbp = +v.sbp, hr = +v.hr;
  const parts = [
    ['BUN', bun >= 70 ? 6 : bun >= 28 ? 4 : bun >= 22.4 ? 3 : bun >= 18.2 ? 2 : 0],
    ['Hb', hb < 10 ? 6 : v.sex === 'male' ? (hb < 12 ? 3 : hb < 13 ? 1 : 0) : (hb < 12 ? 1 : 0)],
    ['SBP', sbp < 90 ? 3 : sbp < 100 ? 2 : sbp < 110 ? 1 : 0],
    ['HR', hr >= 100 ? 1 : 0],
    ...flags.map(([k, l, p]) => [l, v[k] === 'yes' ? p : 0]),
  ];
  return { total: parts.reduce((n, [, p]) => n + p, 0), parts, errors, missing: [], unstable: sbp < 90 };
}

export const transfusionContexts = ['stable', 'cv', 'acute', 'variceal'];

export function transfusionAdvice(hb, context) {
  if (!numeric(hb) || +hb <= 0 || +hb > 30 || !transfusionContexts.includes(context)) return null;
  if (context === 'acute') {
    return {
      title: '立即個別化評估',
      text: 'ACS、休克或持續大量失血：不能等待 Hb 降至 7 g/dL 才處置。同步復甦、控制出血，依灌流、缺血與動態失血情形，由臨床團隊決定輸血。急性出血初期 Hb 可能尚未下降。',
    };
  }
  if (context === 'cv') {
    return {
      title: +hb <= 8 ? '達 ESGE 心血管疾病情境參考閾值' : '尚未達參考閾值，持續評估',
      text: '穩定且有急性或慢性心血管疾病病史：ESGE 2021 採 Hb ≤8 g/dL 的較寬鬆閾值，提出輸後 ≥10 g/dL 目標（低品質證據）。此目標須個別化；ACS 請改選急性情境並依當時心臟科指引。',
    };
  }
  return {
    title: +hb <= 7 ? '約達限制性輸血參考閾值' : 'Hb 高於一般限制性參考閾值',
    text: context === 'variceal'
      ? '靜脈曲張出血採保守輸血；Baveno VII 目標 Hb 7–8 g/dL，依持續失血、灌流、年齡與心血管疾病調整，避免過度輸血。'
      : '一般穩定 UGIB：ACG 2021 建議閾值 7 g/dL；ESGE 2021 無心血管病史者 Hb ≤7 g/dL 時考慮輸血，輸後目標 7–9 g/dL。數值不能單獨決定是否輸血。',
  };
}

// Child–Pugh (bilirubin mg/dL, albumin g/dL, INR; ascites/HE graded 1–3).
export const emptyChildPugh = { bili: '', alb: '', inr: '', ascites: '', he: '' };

export function childPugh(v) {
  const missing = Object.keys(emptyChildPugh).filter(k => isBlank(v[k]));
  const errors = {};
  for (const [key, label, min, max] of [['bili', '膽紅素', 0.1, 60], ['alb', '白蛋白', 0.5, 7], ['inr', 'INR', 0.5, 15]]) {
    if (!missing.includes(key) && (!numeric(v[key]) || +v[key] < min || +v[key] > max)) {
      errors[key] = `${label} 請輸入 ${min}–${max}。`;
    }
  }
  for (const key of ['ascites', 'he']) {
    if (!missing.includes(key) && !['1', '2', '3'].includes(String(v[key]))) errors[key] = '請選擇分級。';
  }
  if (missing.length || Object.keys(errors).length) return { total: null, cls: null, missing, errors };
  const bili = +v.bili, alb = +v.alb, inr = +v.inr;
  const total =
    (bili < 2 ? 1 : bili <= 3 ? 2 : 3) +
    (alb > 3.5 ? 1 : alb >= 2.8 ? 2 : 3) +
    (inr < 1.7 ? 1 : inr <= 2.3 ? 2 : 3) +
    +v.ascites + +v.he;
  return { total, cls: total <= 6 ? 'A' : total <= 9 ? 'B' : 'C', missing: [], errors };
}

export function tipsAdvice(child, active, hvpg) {
  if (child !== '' && (!numeric(child) || !Number.isInteger(+child) || +child < 5 || +child > 15)) {
    return { kind: 'invalid', text: 'Child–Pugh 總分須為 5–15 的整數。' };
  }
  if (hvpg !== '' && (!numeric(hvpg) || +hvpg < 0 || +hvpg > 80)) {
    return { kind: 'invalid', text: 'HVPG 請輸入 0–80 mmHg，未知可留白。' };
  }
  if (+child >= 14) {
    return { kind: 'special', text: 'Child–Pugh 14–15：不屬一般 pre-emptive TIPS 選擇條件。需肝臟／介入／移植團隊個別評估效益與無效治療風險；不能由本工具自動排除救援治療。' };
  }
  if ((+child >= 10 && +child <= 13) || (+child >= 8 && +child <= 9 && active === 'yes') || (hvpg !== '' && +hvpg > 20)) {
    return { kind: 'eligible', text: '符合至少一項高風險條件：立即聯絡肝臟與介入團隊評估 pre-emptive TIPS。此為轉介提示，仍須確認出血型態、禁忌與整體適應性。' };
  }
  if (child === '' || (active === '' && +child >= 8 && +child <= 9)) {
    return { kind: 'incomplete', text: '資料不足，無法排除高風險。請完成 Child–Pugh 與必要的內視鏡出血資訊；HVPG 未測量可留白。' };
  }
  return { kind: 'not-met', text: '已填資料未符合所列條件；HVPG 未測量不代表正常。本結果不是低風險或不需 TIPS 的判定。若止血失敗，依救援流程處理。' };
}

// Forrest classes split per ESGE 2021 statements 5–7 / ACG 2021.
export const forrestGuidance = {
  active: 'Forrest Ia / Ib（噴射或滲血）：需內視鏡止血。ESGE 2021 建議 epinephrine 注射合併第二種方式（接觸式熱凝固或機械夾）；epinephrine 不可單獨使用。ACG 2021 亦建議活動出血潰瘍可考慮 TC-325 止血粉。標準方式無法止血時，考慮止血粉或 cap-mounted clip（OTSC）。',
  nbvv: 'Forrest IIa（可見血管，未出血）：需內視鏡止血。熱凝固、機械夾或硬化劑注射，可單用或合併 epinephrine；epinephrine 不可單獨使用。',
  clot: 'Forrest IIb（附著血塊）：ESGE 建議考慮移除血塊，處理下方高風險病灶；ACG 對沖洗後仍附著血塊的內視鏡治療無法提出贊成或反對建議。未接受內視鏡治療者仍給高劑量 PPI，個別評估。',
  low: 'Forrest IIc / III（平坦色素斑或乾淨基底）：通常不需內視鏡止血；依整體臨床狀態、病因與追蹤安排考慮提早出院。',
};
