import React, { useState } from 'react';
import { tipsAdvice, childPugh, emptyChildPugh, forrestGuidance } from './clinical.js';
import { Intro, Steps, Notice, Citations, Select, NumberField } from './components.jsx';

export function NonVariceal() {
  const [forrest, setForrest] = useState('');
  return <>
    <Intro title="非靜脈曲張 UGIB" subtitle="先復甦，再依內視鏡病灶處理" />
    <Notice tone="warning">休克、持續大量吐血或呼吸道保護困難：立即啟動急救與專科支援；時間目標不是等待時間。</Notice>
    <Steps items={[
      ['初步評估與復甦', '評估 ABC、意識與灌流，建立靜脈通路，檢驗 CBC、凝血、腎肝功能及備血。持續監測生命徵象、尿量與失血。選擇性保護呼吸道，輸液／輸血依共病調整（限制性輸血見「輸血策略」）。'],
      ['GBS 分流與內視鏡前準備', 'GBS 0–1 且穩定、無持續出血並有可靠追蹤者，可由醫師考慮門診。住院病人復甦後於 24 小時內內視鏡；ESGE 2021 不建議 ≤12 小時的急診內視鏡（與 ≤24 小時相比未改善預後）。ACG 2021 建議內視鏡前輸注 erythromycin（ESGE：嚴重或持續出血時 250 mg IV，內視鏡前 30–120 分鐘），先確認 QT 與交互作用。ESGE 可考慮內視鏡前 IV PPI 但不能延誤內視鏡；ACG 2021 對此無贊成或反對建議。'],
      ['確認出血來源並止血', '以下 Forrest 工具限消化性潰瘍；非潰瘍來源依病因處理。若發現靜脈曲張，轉入靜脈曲張流程。'],
      ['止血後與再出血處理', '內視鏡止血後或未處理的 IIb 給高劑量 PPI 72 小時（如 80 mg IV bolus + 8 mg/h，或間歇 IV／口服每日兩次），接續口服 PPI 每日兩次至內視鏡後第 14 天，之後每日一次。再出血先重做內視鏡止血（可考慮 OTSC）；失敗則經導管動脈栓塞（TAE），無法施行或失敗時外科處置。'],
      ['抗栓藥與出院計畫', '低劑量 aspirin 單方作次級預防者：ESGE 建議不中斷；若中斷，盡早（最好 3–5 天內）恢復。需持續抗凝血者：出血控制後盡早恢復，最好於出血後 7 天內或稍後，依血栓風險決定；DOAC 起效快需納入考量。檢測並根除 H. pylori，急性期陰性需複驗，治療後確認根除。停用非必要 NSAID，安排追蹤。'],
    ]} />
    <section className="interactive-block">
      <h3>潰瘍內視鏡病灶提示</h3>
      <Select id="forrest" label="Forrest 分類" value={forrest} onChange={setForrest} options={[
        ['active', 'Ia / Ib：噴射或滲血'],
        ['nbvv', 'IIa：可見血管（未出血）'],
        ['clot', 'IIb：附著血塊'],
        ['low', 'IIc / III：平坦色素斑或乾淨基底'],
      ]} />
      <div aria-live="polite"><p>{forrestGuidance[forrest] ?? '選擇內視鏡所見，查看對應處置重點。'}</p></div>
    </section>
    <Citations ids={[0, 1]} />
  </>;
}

function ChildPughCalculator({ onUse }) {
  const [v, set] = useState({ ...emptyChildPugh });
  const r = childPugh(v);
  const update = k => value => set(p => ({ ...p, [k]: value }));
  return (
    <details className="child-pugh">
      <summary>Child–Pugh 計算器（不知道總分時使用）</summary>
      <div className="detail-body">
        <div className="tips-form">
          <NumberField id="cp-bili" label="總膽紅素（mg/dL）" value={v.bili} onChange={update('bili')} min={0.1} max={60} error={r.errors.bili} />
          <NumberField id="cp-alb" label="白蛋白（g/dL）" value={v.alb} onChange={update('alb')} min={0.5} max={7} error={r.errors.alb} />
          <NumberField id="cp-inr" label="INR" value={v.inr} onChange={update('inr')} min={0.5} max={15} error={r.errors.inr} />
          <Select id="cp-ascites" label="腹水" value={v.ascites} onChange={update('ascites')} options={[['1', '無'], ['2', '輕度／利尿劑可控制'], ['3', '中重度／難治']]} />
          <Select id="cp-he" label="肝性腦病變" value={v.he} onChange={update('he')} options={[['1', '無'], ['2', '第 1–2 級'], ['3', '第 3–4 級']]} />
        </div>
        <p aria-live="polite" className="cp-result">
          {r.total === null ? '完成五項後計算。' : <>Child–Pugh <strong>{r.total} 分（{r.cls} 級）</strong>
            <button type="button" className="outline small" onClick={() => onUse(String(r.total))}>帶入 TIPS 檢核</button></>}
        </p>
        <p className="muted">膽紅素 &lt;2／2–3／&gt;3 mg/dL；白蛋白 &gt;3.5／2.8–3.5／&lt;2.8 g/dL；INR &lt;1.7／1.7–2.3／&gt;2.3；各 1／2／3 分。原發性膽汁性疾病之膽紅素切點不同，本計算器不適用。</p>
      </div>
    </details>
  );
}

export function Variceal() {
  const [child, setChild] = useState('');
  const [active, setActive] = useState('');
  const [hvpg, setHvpg] = useState('');
  const result = tipsAdvice(child, active, hvpg);
  return <>
    <Intro title="疑似／確認靜脈曲張出血" subtitle="藥物與抗生素立即開始，復甦後 12 小時內內視鏡" />
    <Notice tone="warning">已知或疑似肝硬化合併 UGIB：立即啟動組合治療與胃腸肝膽團隊評估，不等內視鏡確認才開始藥物。</Notice>
    <Steps items={[
      ['立即復甦與監測', '評估灌流與呼吸道；意識改變或持續吐血者於內視鏡前評估插管。安排加護或中重度監測；保守輸血，Baveno VII Hb 目標 7–8 g/dL，依共病及出血調整。避免過量輸液。'],
      ['儘早開始 vasoactive drug', '疑似時即開始 terlipressin、somatostatin 或 octreotide；確認門脈高壓出血後通常持續 2–5 天。依院內藥品、心肺狀態與禁忌選擇，使用 terlipressin 應監測血鈉。'],
      ['Ceftriaxone prophylaxis', '入院即開始抗生素預防。常用 ceftriaxone 1 g IV 每 24 小時；AASLD 2024 guidance statement 27 為最多 5 天，止血且無活動感染時可停。按過敏、當地抗藥性與院內政策調整；已有感染須另按感染治療，不套用預防療程。'],
      ['12 小時內 endoscopy／EVL', '自就醫起算，完成血流動力復甦後 12 小時內內視鏡；若不穩定，於安全可行時儘速進行。食道靜脈曲張以 EVL 止血。GOV1 可 EVL 或組織膠；GOV2／IGV1 胃底靜脈曲張不可一律套用 EVL，需組織膠或依血管解剖、專業資源評估 TIPS／RTO。'],
      ['及早評估 pre-emptive TIPS', '初步止血後即辨識高風險，不等再出血。Baveno VII：72 小時內，理想 <24 小時；AASLD 2024 statement 32 明確以首次上消化道內視鏡起算，72 小時內、理想 24 小時內。院內無資源時及早安排轉介。'],
      ['止血失敗與後續預防', '藥物加內視鏡仍無法止血：考慮 salvage TIPS；早期再出血評估 rescue TIPS。食道覆膜金屬支架或球囊壓迫僅為專業監測下的橋接。穩定後，未接受 TIPS 者安排 NSBB 加重複 EVL 次級預防；確認單純靜脈曲張來源且無其他適應症，停用 PPI。'],
    ]} />
    <section className="interactive-block">
      <h3>Pre-emptive TIPS 高風險條件檢核</h3>
      <p>主要用於急性食道靜脈曲張出血；Baveno VII 亦列 GOV1／GOV2，胃底靜脈曲張仍需專科評估。</p>
      <ul>
        <li>Child–Pugh C <strong>10–13 分</strong>；或</li>
        <li>Child–Pugh B <strong>8–9 分且首次內視鏡仍活動性出血</strong>；或</li>
        <li>出血當時已測得 <strong>HVPG &gt;20 mmHg</strong>（Baveno VII）。不為完成此工具而常規加做 HVPG。</li>
      </ul>
      <div className="tips-form">
        <NumberField id="child" label="Child–Pugh 總分" value={child} onChange={setChild} min={5} max={15} step="1" />
        <Select id="active" label="首次內視鏡活動性出血" value={active} onChange={setActive} />
        <NumberField id="hvpg" label="HVPG（mmHg，未測可留白）" value={hvpg} onChange={setHvpg} max={80} />
      </div>
      <ChildPughCalculator onUse={setChild} />
      <Notice tone={result.kind === 'eligible' ? '' : result.kind === 'invalid' ? 'danger' : 'warning'}>
        <div aria-live="polite">{result.text}</div>
      </Notice>
      <button type="button" className="outline" onClick={() => { setChild(''); setActive(''); setHvpg(''); }}>清除 TIPS 輸入</button>
      <p className="muted">條件符合不等於可直接施作。須評估心肺疾病、感染、血管解剖、肝腎功能與移植計畫；嚴重腎病／透析族群在早期 TIPS 試驗代表性有限。Child–Pugh ≥14，或 MELD &gt;30 且 lactate &gt;12 mmol/L，應由專科個別衡量無效治療風險與近期移植可能性。</p>
    </section>
    <Citations ids={[2, 3, 4]} />
  </>;
}
