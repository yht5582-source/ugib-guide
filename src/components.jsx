import React from 'react';

const yesNo = [['no', '否'], ['yes', '是']];

export function Select({ id, label, value, onChange, options = yesNo, hint, error }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={e => onChange(e.target.value)}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}>
        <option value="">請選擇</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {hint && <small>{hint}</small>}
      {error && <small className="error" id={`${id}-error`}>{error}</small>}
    </label>
  );
}

export function NumberField({ id, label, value, onChange, min = 0, max = 500, step = 'any', error, placeholder }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value}
        placeholder={placeholder} onChange={e => onChange(e.target.value)}
        onWheel={e => e.currentTarget.blur()}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
      {error && <small className="error" id={`${id}-error`}>{error}</small>}
    </label>
  );
}

export const Notice = ({ children, tone = '' }) => <div className={`notice ${tone}`}>{children}</div>;

export const Intro = ({ title, subtitle, children }) => (
  <header className="intro">
    <h2>{title}</h2>
    <p className="subtitle">{subtitle}</p>
    {children && <p>{children}</p>}
  </header>
);

export const sources = [
  ['ACG 2021', 'Laine et al. Upper Gastrointestinal and Ulcer Bleeding. Am J Gastroenterol. 116:899–917.', 'https://doi.org/10.14309/ajg.0000000000001245', 'GBS（Table 2）、輸血 7 g/dL、erythromycin、24 h 內內視鏡、潰瘍止血（含 TC-325、OTSC）與 PPI。'],
  ['ESGE 2021', 'Gralnek et al. Nonvariceal upper gastrointestinal hemorrhage. Endoscopy. 53:300–332.', 'https://doi.org/10.1055/a-1369-5274', '低風險分流、不建議 ≤12 h 急診內視鏡、心血管疾病輸血差異、Forrest 分類、抗血小板／抗凝血恢復與再出血。'],
  ['Baveno VII 2022', 'de Franchis et al. Renewing consensus in portal hypertension. J Hepatol. 76:959–974.', 'https://doi.org/10.1016/j.jhep.2021.12.022', '第 6 節：急性靜脈曲張出血；6.27：pre-emptive TIPS 條件。'],
  ['AASLD 2024', 'Kaplan et al. Risk stratification and management of portal hypertension and varices in cirrhosis. Hepatology. 79:1180–1211.', 'https://doi.org/10.1097/HEP.0000000000000647', '急性出血組合治療、抗生素與高風險病人 TIPS；2023 線上發表，2024 正式卷期。'],
  ['AASLD TIPS 2024', 'Lee et al. TIPS, variceal embolization, and retrograde transvenous obliteration in variceal hemorrhage. Hepatology. 79:224–250.', 'https://doi.org/10.1097/HEP.0000000000000530', 'TIPS 與胃靜脈曲張之介入治療背景。'],
];

export function Citations({ ids }) {
  return (
    <p className="citations">依據：{ids.map((i, n) => (
      <React.Fragment key={i}>{n > 0 ? ' · ' : ''}<a href={sources[i][2]} target="_blank" rel="noreferrer">{sources[i][0]}</a></React.Fragment>
    ))}</p>
  );
}

export function Steps({ items }) {
  return (
    <ol className="steps">
      {items.map(([title, text], i) => (
        <li key={title}>
          <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
          <div><h3>{title}</h3><p>{text}</p></div>
        </li>
      ))}
    </ol>
  );
}
