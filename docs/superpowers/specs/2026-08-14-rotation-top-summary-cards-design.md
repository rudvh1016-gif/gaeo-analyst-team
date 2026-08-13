# Rotation Top Summary Cards Design

## Scope

Only the six summary cards directly below the rotation hero change. The rotation engine, snapshot schema, horizon selection, map, ranking, selected-sector detail, lead-lag, similar markets, candidates, current view, walk-forward results, explanations, lazy loading, and responsive page structure remain unchanged.

## Chosen approach

Use semantic presentation markup and a scoped `.rot-summary` typography system. This is preferred over a CSS-only adjustment because the today card must move the sector subject before its return, and metadata must become distinct label/value blocks. It is safer than changing a shared card component because `rotation.css` already owns these cards and no other page needs to change.

Alternatives rejected:

1. CSS-only restyling cannot remove the ambiguity of the today return or create meaningful metadata groups.
2. A global card redesign risks changing unrelated GAEO pages and violates the locked scope.

## Information hierarchy

Every card uses four levels:

1. Context: small neutral semibold text.
2. Primary: near-black sector, regime, or horizon value.
3. Secondary: score, state, or concise meaning.
4. Metadata: semantic label/value pairs with larger gaps between blocks than within a block.

The current-observation card displays a shortened dynamic copy, `<leader sector> 순환 신호`, using the existing leader. The today card shows the same leader sector first, then its one-day adjusted return and state. The measure label is `구성 종목 중앙값 등락 · 표본 보정` because `todayView.returnValue` reads `period.return.adjusted`, which is the sector median return shrunk toward the universe median according to sample size.

## Visual system

- Palette: existing white card, `#1d1d1f` ink, neutral gray secondary text, restrained existing GAEO blue only on the current-observation title, and existing Korean market direction colors.
- Type: existing Pretendard stack only. Context 11px, primary 18 to 21px, secondary 12px, metadata labels 11px semibold, metadata values 11px regular.
- Layout: preserve the existing six-column desktop grid and current responsive wrapping. Add breathing room inside cards without forcing equal-height text compression.
- Signature: quiet editorial metadata rhythm, not boxes, pills, icons, gradients, shadows, or decorative accents.

## Data mapping

- Recommended horizon: `data.recommendedHorizon.horizon`, with current summary fallback.
- Leader and score: `data.summary.leaders[0]`.
- Today subject: the same leader sector.
- Today return: `leaderSector.periods['1'].return.adjusted`.
- Today relative return: `leaderSector.periods['1'].relativeStrength`.
- Today breadth: `leaderSector.periods['1'].breadth.adjustedUpRate`.
- Calculation range: `data.summary.period`.
- Expected observation range: `data.summary.candidateObservationPeriod`.
- Validation range and evaluation count: recommended horizon row in `data.horizonPerformance`.
- Regime and breadth range: `data.marketRegime` and `data.marketRegime.breadthPeriod`.
- Short-term reference: `data.summary.shortTerm`.

No example value is hardcoded.

## Responsive behavior

At 1920, 1440, and 1280 the existing six-card grid remains. Existing breakpoints wrap to three and two columns. Mobile retains the same reading order and keeps the today subject immediately above the today return. Card padding remains within the existing design scale, with 16 to 18px horizontal and 18 to 22px vertical space on mobile.

## Verification

- Contract tests assert the semantic hierarchy, dynamic horizon use, precise today metric label, subject-first order, and preservation of all metadata.
- CSS tests assert scoped typography, no gradient or new heavy decoration, and unchanged grid proportions.
- Playwright checks 1920, 1440, 1280, 1024, 768, 390, and 360 widths; today subject order; maximum two-line lead title; no overflow; dark mode; and unchanged lower rotation sections.
- Run the complete existing static regression suite before integration.
