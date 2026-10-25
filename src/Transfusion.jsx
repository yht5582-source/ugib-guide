import React, { useState } from 'react';
import { transfusionAdvice, numeric } from './clinical.js';
import { Intro, NumberField, Select, Notice, Citations } from './components.jsx';

export default function Transfusion() {
  const [hb, setHb] = useState('');
  const [context, setContext] = useState('');
  const advice = transfusionAdvice(hb, context);
  const hbError = hb !== '' && (!numeric(hb) || +hb <= 0 || +hb > 30) ? 'Hb 請輸入 >0 至 30 g/dL。' : undefined;

  return <>
    <Intro title="輸血閾值與策略" subtitle="以灌流與出血狀態優先，Hb 作為參考" />
    <Notice tone="warning">ACS、持續失血或休克需個別化；急性大量出血初期 Hb 可能低估嚴重程度，不可等待固定閾值。</Notice>
    <div className="calculator compact">
      <section className="form-panel">
        <h3>選擇臨床情境</h3>
        <NumberField id="transfusion-hb" label="目前 Hb（g/dL）" value={hb} onChange={setHb} min={0.1} max={30} error={hbError} />
        <Select id="context" label="輸血情境" value={context} onChange={setContext} options={[
          ['stable', '血流動力穩定，無心血管病史'],
          ['cv', '穩定，有心血管疾病病史'],
          ['acute', 'ACS／持續大量失血／休克'],
          ['variceal', '穩定的靜脈曲張出血'],
        ]} />
        <button type="button" className="outline" onClick={() => { setHb(''); setContext(''); }}>清除輸血輸入</button>
      </section>
      <aside className="result-panel" aria-live="polite">
        <h3>{advice?.title ?? '待完成情境評估'}</h3>
        <p>{advice?.text ?? '請輸入有效 Hb（>0 至 30 g/dL）並選擇情境。若病人不穩定，立即處理，不必等待本工具結果。'}</p>
        <p>此工具不計算輸血單位、不產生醫囑。每次輸血後重評症狀、灌流與 Hb；心衰竭、腎衰竭或透析病人須留意容量負荷。</p>
      </aside>
    </div>
    <h3>一般限制性策略</h3>
    <div className="table-wrap"><table>
      <caption>各指引參考閾值（g/dL）</caption>
      <thead><tr><th>情境</th><th>輸血閾值</th><th>輸後目標</th><th>來源</th></tr></thead>
      <tbody>
        <tr><th>非靜脈曲張，穩定、無心血管病史</th><td>7</td><td>7–9</td><td>ACG 2021；ESGE 2021</td></tr>
        <tr><th>非靜脈曲張，有心血管疾病</th><td>≤8</td><td>≥10</td><td>ESGE 2021（低品質證據）</td></tr>
        <tr><th>靜脈曲張出血</th><td>7</td><td>7–8</td><td>Baveno VII；AASLD 2024</td></tr>
        <tr><th>ACS／休克／大量失血</th><td colSpan="2">個別化，不等待固定 Hb</td><td>—</td></tr>
      </tbody>
    </table></div>
    <Citations ids={[0, 1, 2, 3]} />
  </>;
}
