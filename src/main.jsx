import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GBS from './GBS.jsx';
import Transfusion from './Transfusion.jsx';
import { NonVariceal, Variceal } from './Pathways.jsx';
import { sources, Intro } from './components.jsx';
import './styles.css';

const CHECKED = '2026-10-25';

function References() {
  return <>
    <Intro title="參考來源與適用範圍" subtitle="依指定版本整理，並非即時更新的指南服務" />
    <p>供醫療專業人員用於成人 UGIB 臨床決策輔助；摘要不能取代原文、院內流程或專科會診。內容核對日：{CHECKED}。指南年份與核對日期不同，不代表已納入該日所有最新指引。</p>
    <ol className="references">{sources.map(([name, title, url, scope]) => (
      <li key={name}><h3><a href={url} target="_blank" rel="noreferrer">{name}</a></h3><p>{title}</p><p className="muted">{scope}</p></li>
    ))}</ol>
    <h3>解讀上的差異</h3>
    <ul>
      <li>ACG 2021 對內視鏡前 PPI 無法提出贊成或反對建議；ESGE 2021 可考慮使用，但不延誤內視鏡。</li>
      <li>Erythromycin：ACG 2021 建議內視鏡前使用；ESGE 2021 限嚴重或持續出血。</li>
      <li>輸血以一般限制性策略為起點；心血管疾病、ACS、休克與持續失血不應僅依 Hb。</li>
      <li>Ceftriaxone 療程採所列 AASLD 2024 statement 27：最多 5 天；勿與其他版本的 7 天建議混用。</li>
      <li>TIPS 時窗：Baveno VII 第 6.27 節寫 72 h 內、理想 &lt;24 h；AASLD statement 32 明定從首次上消化道內視鏡起算。</li>
    </ul>
    <h3>資料與隱私</h3>
    <p>無病人識別欄位、帳號、後端資料庫或分析追蹤。計算資料不寫入網址、localStorage 或伺服器；網址只記錄目前分頁。重新整理或關閉頁面即清除輸入。GitHub Pages 仍可能保留一般網站連線紀錄。請勿在 GitHub issue 提供病人資訊。</p>
  </>;
}

const tabs = [
  ['gbs', 'GBS 計算器', GBS],
  ['transfusion', '輸血策略', Transfusion],
  ['nonvariceal', '非靜脈曲張', NonVariceal],
  ['variceal', '靜脈曲張', Variceal],
  ['references', '參考來源', References],
];

const tabFromHash = () => Math.max(0, tabs.findIndex(([id]) => `#${id}` === location.hash));

function App() {
  const [tab, setTab] = useState(tabFromHash);

  useEffect(() => {
    const onHash = () => setTab(tabFromHash());
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  const select = i => {
    setTab(i);
    history.replaceState(null, '', `#${tabs[i][0]}`);
  };

  return <div className="app">
    <a className="skip" href="#content" onClick={e => { e.preventDefault(); document.getElementById('content').focus(); }}>跳到主要內容</a>
    <header className="site-header">
      <div className="brand"><h1>上消化道出血</h1><span>臨床決策輔助</span></div>
      <p>ACG 2021 · ESGE 2021 · Baveno VII 2022 · AASLD 2024</p>
    </header>
    <div className="disclaimer"><span aria-hidden="true">!</span><strong>臨床決策輔助，不能取代醫師判斷。</strong></div>
    <nav aria-label="臨床工具分頁">
      {tabs.map(([id, label], i) => (
        <button type="button" key={id} aria-current={tab === i ? 'page' : undefined} onClick={() => select(i)}>
          <span className="tab-num">{i + 1}</span>{label}
        </button>
      ))}
    </nav>
    <main id="content" tabIndex="-1">
      {/* Keep every tab mounted so inputs survive tab switches. */}
      {tabs.map(([id, , Panel], i) => <div key={id} hidden={tab !== i}><Panel /></div>)}
    </main>
    <p className="privacy">僅在此瀏覽器計算，不儲存病人資料。</p>
    <footer>
      <strong>上消化道出血</strong>
      <span>ACG 2021 · ESGE 2021 · Baveno VII 2022 · AASLD 2024</span>
      <span>臨床決策輔助 · 內容核對 {CHECKED}</span>
    </footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
