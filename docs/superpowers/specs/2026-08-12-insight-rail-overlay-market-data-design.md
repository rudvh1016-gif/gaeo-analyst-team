# Insight Rail Overlay and Market Data Design

## Goal

Keep the desktop page geometry unchanged when the insight rail opens, make every rail label a single horizontal line, and enrich stock rows with current prices while showing the current aggregate score in the recent list.

## Interaction

- The rail remains fixed to the left edge on desktop.
- Opening any tab reveals the 300px panel as an overlay; it never changes `.wrap` width, margin, or position.
- Existing click, keyboard, escape, persistence, dark-mode, and mobile behavior remains unchanged.
- Rail labels use a compact single-line style so `상위 30`, `오늘의 변화`, and `최근 본` do not wrap.

## Data display

- Top 30, today changes, realtime, and recent rows look up the latest available `STOCKS[code].price` at render time and place a compact won price beside the stock name.
- Recent rows also look up the current `HOME_BRIEF.signals[code].t` aggregate score, with ranked data as a fallback. Stored recent-history records remain limited to code, name, and visit time so values never become stale.
- Won values are rounded to whole won and formatted with thousands separators. Realtime event values whose unit is `원` use the same formatter, eliminating `.0원`; scores and ratios retain one decimal place.
- Missing prices or scores are omitted instead of displaying misleading placeholders beside the name.

## Verification

- Unit tests cover won formatting and current score resolution.
- Browser tests verify that `.wrap` has identical geometry before and after opening a panel, labels stay on one line, integer-won realtime values have no decimal suffix, all four stock tabs show a current price, and recent rows show a current aggregate score.
