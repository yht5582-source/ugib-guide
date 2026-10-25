# 上消化道出血｜臨床決策輔助

響應式繁體中文互動網頁，供醫療專業人員參考。**臨床決策輔助，不能取代醫師判斷。**

- 網頁：https://yht5582-source.github.io/ugib-guide/
- Repository：https://github.com/yht5582-source/ugib-guide

## 功能與範圍

- Glasgow–Blatchford Score（0–23）：BUN mg/dL、Hb g/dL、SBP、HR、男女 Hb 分層與四項臨床表現；逐項計分，缺值不當作 0。
- 輸血情境：一般穩定、心血管病史、ACS／休克／持續大量失血、靜脈曲張。
- 非靜脈曲張出血流程及 Forrest 病灶提示。
- 靜脈曲張組合治療、12 小時內內視鏡／EVL、pre-emptive TIPS 條件檢核、救援與次級預防。
- 各頁來源年份、原文 DOI 與指南差異說明。

依使用者指定的 ACG 2021、ESGE 2021、Baveno VII 2022、AASLD 2024 整理；內容核對日 2026-10-25。這不是涵蓋所有最新指南的即時服務。AASLD 2024 門脈高壓 guidance statement 27 的 ceftriaxone 預防療程為最多 5 天，止血且無活動感染時可停；不混用其他文件的 7 天建議。

GBS 採 ACG Table 2 的 BUN 18.2、22.4、28、70 mg/dL 邊界。勿混入 total urea 或其他單位。腎衰竭／透析、慢性貧血影響解讀，工具不自行校正分數。輸入防誤植範圍不是生理安全值。GBS 0–1 不是自動出院許可，TIPS 檢核也不是適應性／禁忌完整評估。

## 本機執行

需要 Node.js 22.12+ 與 pnpm 10（可使用 Corepack）。

```sh
corepack enable
corepack prepare pnpm@10.17.1 --activate
pnpm install --frozen-lockfile
pnpm dev
```

開啟終端顯示網址下的 `/ugib-guide/`（通常 `http://127.0.0.1:5173/ugib-guide/`）。

```sh
pnpm test
pnpm build
pnpm preview
```

正式檔案輸出在 `dist/`。React + Vite，純靜態、沒有 API key 或後端服務。

## GitHub Pages 部署

此 repository 使用 GitHub Actions。Settings → Pages → Build and deployment → Source 選 **GitHub Actions**。推送 `main` 或手動執行 Deploy Pages 工作流程，即會安裝鎖定依賴、執行臨床邏輯測試、建置並發布 `dist/`。

流程具 `contents: read`、`pages: write`、`id-token: write` 最小必要權限；正式環境為 `github-pages`。如複製到其他 repo 名稱，請同步修改 `vite.config.js` 的 `base`。不需要將 `dist/` 提交到 main，也不需要 gh-pages 分支。

## 驗證

`pnpm test` 使用 Node test runner，涵蓋男女 Hb／BUN／SBP／HR 全部邊界、0 與 23 分、缺值與無效輸入、輸血分支、TIPS 7/8/9/10/13/14/15 分與 HVPG >20 邊界。部署另於瀏覽器驗證桌機與手機、分頁、清除、計分、Forrest、TIPS 及公開資產載入。

## 資料與隱私

無病人識別欄位、資料庫、cookie、localStorage 或分析追蹤。輸入只在當次頁面記憶體，切換分頁保留、重新整理清除；不寫入 URL（網址只記錄目前分頁） 或傳送至伺服器。GitHub Pages 仍可能保留一般連線紀錄。請勿把真實病人資料提交到 issue。

## 主要來源

1. Laine L, et al. **ACG 2021**. Am J Gastroenterol. 116:899–917. [DOI](https://doi.org/10.14309/ajg.0000000000001245)
2. Gralnek IM, et al. **ESGE 2021**. Endoscopy. 53:300–332. [DOI](https://doi.org/10.1055/a-1369-5274)
3. de Franchis R, et al. **Baveno VII 2022**. J Hepatol. 76:959–974. [DOI](https://doi.org/10.1016/j.jhep.2021.12.022)
4. Kaplan DE, et al. **AASLD 2024**. Hepatology. 79:1180–1211. [DOI](https://doi.org/10.1097/HEP.0000000000000647)
5. Lee EW, et al. **AASLD TIPS 2024**. Hepatology. 79:224–250. [DOI](https://doi.org/10.1097/HEP.0000000000000530)

本工具以自行撰寫的摘要呈現；不包含指南原文全文、專有圖版或商標。臨床使用前請由機構確認與院內流程的適用性。
