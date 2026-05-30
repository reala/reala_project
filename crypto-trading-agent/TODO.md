# 📈 프로젝트 마스터 작업지시서: crypto-trading-agent

## 1. 프로젝트 개요 및 핵심 아키텍처

본 프로젝트는 **Gemini 2.0 Flash의 무료 티어 제한(일일 20회 호출 [20 RPD], 100만 TPM)** 환경을 완벽하게 방어하면서,
국내 최대 거래소인 **업비트(Upbit)**에서 최고 메이저 자산 3대장을 안전하게 자율 매매하는 하이브리드 인프라 구축을 목표로 한다.

### ⚙️ 하이브리드 아키텍처 원칙

1. **파이썬 단 가공 (Data Slimming):** 모든 시세 데이터 및 기술적 지표 계산은 파이썬(`pyupbit`)이 선행하여 Gemini의 토큰 소모를 최소화한다.
2. **1-Turn 압축 추론:** 에이전트 루프의 티키타카를 배제하고, 하루 딱 1회만 Gemini를 호출하여 `[BUY/SELL/HOLD]` 의사결정을 JSON으로 받아낸다.
3. **물리적 안전장치:** Gemini의 판단 금액과 무관하게, 파이썬 주문 집행 단에서 1회 주문 금액을 **원화 5,000원(시장가)**으로 강제 고정(Slicing)한다.

---

## 2. ✅ 완료된 작업 (검증 포함)

### [x] 2.1 신규 독립 프로젝트 디렉토리 환경 구축
- `crypto-trading-agent` 독립 폴더 생성 및 파이썬 가상환경(`.venv`) 셋팅 완료.
- `requirements.txt` 핵심 패키지(`google-genai`, `python-dotenv`, `requests`, `pyupbit`, `pandas`) 명시 및 설치 완료.
- `.env` 파일에 `UPBIT_ACCESS_KEY`, `UPBIT_SECRET_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 변수 구조 정의 완료.

### [x] 2.2 인프라 공통 모듈 이식 및 검증
- **`app/config.py`:** 업비트 키 포함 `Settings` dataclass 및 `get_settings()` 환경변수 로더 완성. 누락 변수 목록 출력 방어 코드 포함.
- **`app/notifiers/telegram_notifier.py`:** 4,096자 초과 메시지 자동 청킹 발송 로직 완전 재활용. `split_message` 단위 테스트 통과.
- **`app/storage/trade_history.py`:** `data/history.json` 기반 매매 일지 누적 및 자율 깃 커밋(`[skip ci]`) 시스템 이식. load/save 검증 통과.
- **`app/utils/logger.py`:** 표준 stdout 로거 정상 동작 확인.

### [x] 2.3 업비트 연동 클라이언트 뼈대 구축 및 RSI 버그 수정 (`exchange_client.py`)
- `pyupbit.Upbit` 객체 인증 및 KRW/BTC 잔고 조회 함수 구현 완료.
- `pyupbit.get_ohlcv` 일봉 데이터 수집 및 `RSI(14)`, `MA20` 기술적 지표 산출 로직 구현.
- **[버그 수정]** `calc_rsi()`: `avg_loss=0`(순수 상승장) → NaN 반환 버그. `math.isnan` 가드 및 케이스별 분기로 수정 완료.
  - 횡보(flat): `50.0` 반환 ✓ / 순수 상승: `100.0` 반환 ✓ / 순수 하락: `0.0` 반환 ✓
- `MarketSnapshot` 데이터클래스 및 `get_market_snapshot()` 통합 함수 동작 확인.
- 소액(5,000원) 시장가 매수/매도 주문 함수 구현 (잔고 부족 및 최소 주문금액 방어 코드 포함).

### [x] Milestone 1: 파이썬 단 기술적 지표 가공 완성 (`exchange_client.py`)
- `get_market_snapshots()`: KRW 잔고 1회 조회 후 3대장 루프로 `MarketSnapshot` 목록 반환.
- `get_coin_balance(ticker)`: (보유량, 평균 매수가) 튜플 반환 — ETH·SOL 포함 전 티커 공용.
- `MarketSnapshot`: `coin_balance`, `coin_avg_buy_price`, `volume_24h` 포함 완전 통합 구조체.

### [x] Milestone 2: 구조화된 투자 전략 프롬프트 설계 (`strategy_prompt.py`)
- 윌리엄 오닐 추세 매매 페르소나 + 리스크 관리 전문가 시스템 지시문 주입.
- 3대장 MarketSnapshot → 미실현손익(%) 포함 압축 포맷 직렬화.
- 순수 JSON(`target_ticker`, `decision`, `amount_krw`, `reason`) 형식 강제 출력 제한.

### [x] Milestone 3: 메인 오케스트레이터 조립 및 주문 연동 (`app/main.py`)
- 데이터 팩 → Gemini 1-Turn → 주문 집행 → 텔레그램 → history.json 파이프라인 완성.
- `_parse_gemini_response()`: JSON 블록 추출 + 파싱 실패 시 HOLD 기본값 반환.
- `buy_market_order` / `sell_market_order`: 잔고 부족·최소 주문금액 방어 포함 실전 연동.
- 5,000원 물리 락: `TRADE_AMOUNT_KRW = 5_000` 상수로 ExchangeClient 기본값 고정.

---

## 3. 🚀 앞으로 진행할 작업 (마일스톤)

### 📌 Milestone 4: 자율 매매 일지 기록 장치 고도화 (`trade_history.py`)

- [x] **`data/history.json` 스키마 고도화:** `{date, ticker, action, avg_buy_price, coin_volume, reason, price, rsi14, ma20, krw_balance, order_uuid}` 구조화 완료.
- [x] **CI 환경 이중 커밋 방지:** 워크플로 `Save history.json` 스텝을 Python `_git_commit()` 후 스테이징 변경사항 없을 때 push 스킵하도록 수정.

### 📌 Milestone 5: 깃허브 액션 배포 및 고정 IP 프록시 우회 세팅

- [x] **`.github/workflows/trading-scheduler.yml` 구조:** KST 08:50(UTC `50 23 * * *`) 크론탭 + `workflow_dispatch` 수동 트리거 포함.
- [ ] **Fixie / Webshare Proxy 인프라 연동:** 고정 IP 프록시 URL 발급 후 `PROXY_URL` GitHub Secret 등록.
- [ ] **GitHub Secrets 등록:** `UPBIT_ACCESS_KEY`, `UPBIT_SECRET_KEY`, `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` 저장소 Secrets에 등록.
- [ ] **로컬 최종 검증:** `.env` 실제 키 입력 후 `python test_local.py` 실행 → 각 API 연동 확인.
