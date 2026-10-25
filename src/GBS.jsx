import React, { useState } from 'react';
import { calculateGBS, emptyGBS, flags, gbsLabels, gbsRanges } from './clinical.js';
import { Intro, Select, NumberField, Citations, Notice } from './components.jsx';

// 示例 values only — not a real patient.
const example = { sex: 'male', bun: '32', hb: '9.4', sbp: '96', hr: '108', melena: 'yes', syncope: 'no', hepatic: 'no', failure: 'no' };

const numberLabels = { bun: 'BUN（mg/dL）', hb: 'Hb（g/dL）', sbp: '收縮壓 SBP（mmHg）', hr: '心跳 HR（/min）' };

export default function GBS() {
  const [v, set] = useState({ ...emptyGBS });
  const result = calculateGBS(v);
  const update = k => value => set(p => ({ ...p, [k]: value }));
  const filled = Object.values(v).some(x => x !== '');
  const veryLow = result.total !== null && result.total <= 1;

  return <>
    <Intro title="Glasgow–Blatchford Score" subtitle="內視鏡前風險分層">使用臨床與實驗室參數，評估上消化道出血病人需要介入治療（輸血、內視鏡止血或手術）的風險。</Intro>
    <div className="calculator">
      <section className="form-panel">
        <div className="panel-head">
          <h3>臨床參數輸入</h3>
          <button type="button" className="link-button" onClick={() => set({ ...example })}>載入示例</button>
        </div>
        <div className="form-columns">
          <div>
            <Select id="sex" label="性別" value={v.sex} onChange={update('sex')} options={[['male', '男性'], ['female', '女性']]} error={result.errors.sex} />
            {gbsRanges.map(([id, , min, max]) => (
              <NumberField key={id} id={id} label={numberLabels[id]} min={min} max={max}
                value={v[id]} onChange={update(id)} error={result.errors[id]} />
            ))}
          </div>
          <div>
            <h4>臨床表現（是 / 否）</h4>
            {flags.map(([id, label]) => <Select key={id} id={id} label={label} value={v[id]} onChange={update(id)} error={result.errors[id]} />)}
          </div>
        </div>
      </section>
      <aside className="result-panel" aria-live="polite" aria-atomic="true">
        <h3>計算結果</h3>
        <div className="score"><strong>{result.total ?? '—'}</strong><span>/ 23</span></div>
        <h3 className={`result-title${result.total === null ? '' : veryLow ? ' ok' : ' alert'}`}>
          {result.total === null ? '待完成評估' : veryLow ? '極低風險範圍' : '非極低風險範圍'}
        </h3>
        {result.total === null && filled && result.missing.length > 0 &&
          <p className="missing">尚缺：{result.missing.map(k => gbsLabels[k]).join('、')}</p>}
        <p>{result.total === null
          ? '請完成所有欄位並修正無效數值。未完成的資料不代表低風險。'
          : veryLow
            ? 'GBS 0–1：ACG 2021 與 ESGE 2021 認為可考慮門診處置與門診內視鏡；僅在臨床穩定、無持續出血且可確保追蹤時由醫師決定，不可自動出院。'
            : 'GBS ≥2：不符合極低風險門診分流條件。依出血、灌流及共病安排住院評估，復甦後 24 小時內內視鏡；分數本身不能指定 ICU 或處置時機。'}</p>
        {result.unstable && <Notice tone="danger">SBP &lt;90 mmHg：優先評估休克與立即復甦。</Notice>}
        {result.total !== null && <dl className="breakdown">{result.parts.map(([l, p]) => <div key={l}><dt>{l}</dt><dd>+{p}</dd></div>)}</dl>}
        <button type="button" className="outline" onClick={() => set({ ...emptyGBS })}>清除輸入</button>
      </aside>
    </div>
    <details>
      <summary>計分依據與限制</summary>
      <div className="detail-body">
        <p>採 ACG 2021 Table 2 的 BUN（尿素氮）mg/dL 門檻。請勿直接輸入 urea mg/dL、urea mmol/L 或 Hb g/L（urea mmol/L × 2.8 ≈ BUN mg/dL）。性別為原始模型的男女分層。</p>
        <div className="table-wrap"><table>
          <caption>各項加分；未達所列門檻為 0 分</caption>
          <thead><tr><th>變項</th><th>門檻與加分</th></tr></thead>
          <tbody>
            <tr><th>BUN（mg/dL）</th><td>18.2 ≤ BUN &lt;22.4：2；22.4 ≤ BUN &lt;28：3；28 ≤ BUN &lt;70：4；≥70：6</td></tr>
            <tr><th>男性 Hb（g/dL）</th><td>12 ≤ Hb &lt;13：1；10 ≤ Hb &lt;12：3；&lt;10：6</td></tr>
            <tr><th>女性 Hb（g/dL）</th><td>10 ≤ Hb &lt;12：1；&lt;10：6</td></tr>
            <tr><th>SBP（mmHg）</th><td>100 ≤ SBP &lt;110：1；90 ≤ SBP &lt;100：2；&lt;90：3</td></tr>
            <tr><th>HR 與臨床表現</th><td>HR ≥100：1；黑便：1；暈厥：2；肝臟疾病：2；心臟衰竭：2</td></tr>
          </tbody>
        </table></div>
        <p>慢性腎臟病、透析與慢性貧血可能影響 BUN／Hb 與分數解讀，模型不提供腎功能校正；不得自行扣分。GBS 不能排除靜脈曲張出血，也不是死亡率百分比。</p>
        <p>數值輸入範圍是防誤植檢查，不是生理安全範圍；範圍外須人工確認，勿為取得分數而修改實測值。</p>
        <Citations ids={[0, 1]} />
      </div>
    </details>
  </>;
}
