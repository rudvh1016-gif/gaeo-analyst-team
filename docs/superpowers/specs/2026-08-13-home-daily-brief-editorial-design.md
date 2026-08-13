# GAEO Home Daily Brief Editorial Design

## Goal

Recompose only the home page's current-market briefing as a calm, premium financial editorial while preserving every live datum, decision, ranking, route, cache, and existing action.

## Scope

- Keep `LIVE_DATA`, `HOME_BRIEF`, `LIVE_AUTO`, `analysisTally()`, market polling, and all BUY/HOLD/SELL calculations unchanged.
- Change only briefing-scoped markup, styling, rendering, and interaction wiring in `index.html`.
- Add dedicated contract and browser tests. Do not change global card, badge, or button components.
- Keep strong-sector, news, stock-detail, BUY/HOLD/SELL, desktop expansion, and mobile sheet actions available.

## Information Architecture

The briefing becomes one editorial surface. Desktop uses a 60/40 split: market context on the left and today's decisions on the right. Mobile uses the same reading order in one column.

Left column:

1. `DAILY BRIEF` identity, natural market date, and reflected market time.
2. KOSPI, KOSDAQ, and USD/KRW as one restrained index row.
3. Three named editorial sections: Market, Breadth, and Sector. Existing sentences remain the source and are relabeled rather than rewritten.
4. Existing strong-sector and related-news actions.

Right column:

1. Today's BUY/HOLD/SELL counts as large neutral statistics, not colored pills.
2. A one-pixel distribution rule whose segments reflect the real counts.
3. “GAEO가 오늘 높게 보는 종목” showing the first three actual BUY rows, ordered by the existing ranking. Ties remain in the full list and keep stable source order.
4. “BUY 전체 N종목 보기” using the real BUY count. Desktop opens an inline list; mobile opens a bottom sheet.
5. Existing automatic-analysis explanation and compact reflected time.

## Visual System

- Typography: existing Pretendard/system stack; headline 650–700, data 600–650, stock name 550–600, body 400–500.
- Palette: Ink `#17191C`, secondary `#69717C`, hairline `rgba(17,17,17,.09)`, paper via the existing surface token. Direction color is reserved for market movements and the thin distribution rule.
- Structure: whitespace, alignment, type weight, and hairline dividers. No numbered summary badges, signal pills, nested gray cards, gradients, glass, glow, or added shadow.
- Signature: the three editorial labels Market → Breadth → Sector form a quiet reading spine. They encode real content rather than decoration.
- Motion: only expansion/sheet transitions, 280ms; honor `prefers-reduced-motion`.

## Interaction and Accessibility

- BUY/HOLD/SELL count controls remain real buttons when clickable and retain keyboard activation.
- Desktop BUY expansion uses `aria-expanded` and an inline region.
- Mobile BUY list is `role="dialog"`, `aria-modal="true"`, supports Escape and backdrop close, moves focus to Close on open, and restores focus on close.
- Each stock row invokes the existing `jumpToStock()` path.
- Empty BUY state explains that no current BUY decisions exist and does not render an empty action.

## Verification

- Contract tests verify no signal pills/number badges, dynamic counts, three-row preview, complete BUY inclusion, stable tie ordering, and scoped CSS.
- Browser tests verify 1920/1440/1280/1024 desktop layouts, 390/360 mobile layouts, inline expansion, bottom sheet, scroll, close, Escape, focus restoration, and stock navigation.
- Existing static and browser suites must pass. Generated market/analysis files are not modified.

