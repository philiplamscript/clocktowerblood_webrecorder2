---
name: Script status and dist
overview: "Plan 1 (do first): script status under the notepad (confirm/possible/impossible) and auto player distribution from player count. Day editing and voting remaining chips are deferred to a follow-up plan."
todos:
  - id: script-status
    content: ScriptStatusSection under notepad + CharsTab restyle (keep edit/add, 4 cols Towns|Outs|Minion|Demon, no pills, green/none/red); main list Demon→… with hairline dividers + filters; default POSS; migrate —
    status: pending
  - id: auto-dist
    content: BotC distribution table from player count; CharsTab auto-fill + Custom override rotaries above 4 role columns
    status: pending
isProject: false
---

# Plan 1: Script status + auto distribution

**Do first.** Follow-up (Editing Day N + remaining voters) is a separate plan — start after this is confirmed done.

## Scope
- Script status under notepad (§3)
- Auto player distribution from count (§4)

**Deferred:** Editing Day N / Next day, voting “Left” chips (see follow-up plan).

---

## 1. Script status under notepad

**New component** e.g. [`src/components/player-detail/ScriptStatusSection.tsx`](src/components/player-detail/ScriptStatusSection.tsx), rendered in PlayerDetailView **below** [`NoteSection`](src/components/player-detail/NoteSection.tsx), above StatusSection.

**Data:** Pass `chars` + `setChars` from [`App.tsx`](src/App.tsx) / useGameState (PlayerDetailView already receives `chars`; add setter).

### Display rules
- **Category order (top → bottom):** Demon → Minion → Outsider → Townsfolk.
- **No category title rows.** Split only with a thin horizontal rule between non-empty categories.
- **Columns:** `grid-cols-2` → `sm:grid-cols-3` → `md:grid-cols-4` per category block.
- **No status pills.** Cell highlight only:
  - **CONF** → green
  - **POSS** → no highlight (default)
  - **NOT** → red
- **Tap role cell** → cycle `POSS → CONF → NOT → POSS`.
- **Filter buttons:** `ALL | CONF | POSS | NOT` (default `ALL`); omit empty blocks and their dividers.

### Expected layout

```
┌──────────────────────────────────────────┐
│              [ Vote Clock ]              │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  Notepad                          [key]  │
│                                   [tpl]  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  SCRIPT                              ▾   │
│  [ ALL ] [ CONF ] [ POSS ] [ NOT ]       │
├──────────────────────────────────────────┤
│  Imp                                     │
│  ──────────────────────────────────────  │
│  Poisoner    │ Spy       │ S.Woman │Baron│
│  ──────────────────────────────────────  │
│  Butler      │ Drunk     │ Recluse │Saint│
│  ──────────────────────────────────────  │
│  Washerwoman │ Librarian │ Invest. │ Chef│
│   (green)    │  (plain)  │ (plain) │(red)│
│  Empath      │ Fortune…  │ Monk    │ Rav.│
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│  StatusSection                           │
└──────────────────────────────────────────┘
```

**Density:** ~text-[10px]; named roles only; max-height ~40vh scroll.

**Empty script:** hint to Full Ledger → ROLES / Insert Role List.

**Status model** in [`type.tsx`](src/type.tsx):
- `STATUS_OPTIONS = ["POSS", "CONF", "NOT"]` (drop `—`).
- Defaults / addRow use `POSS`; migrate `—` → `POSS` on load in [`useGameState.ts`](src/hooks/useGameState.ts).
- Update [`type.test.ts`](src/type.test.ts).
- Shared cycle helper used by main Script section and Roles page.

---

## 2. Roles page (CharsTab) — keep edit/add; restyle status

**Still the place to edit the script:** add/remove rows, edit role names, Insert Role List. Not removed.

**Layout:** fixed **4 columns** left → right: **Townsfolk | Outsider | Minion | Demon** (same as today`s category columns; keep `grid-cols-4` on this page, including mobile scroll/horizontal if needed so four columns stay).

**Status UI (match main Script section):**
- **Remove pills.**
- Each role row: editable name field; tap name area (or row) cycles `POSS → CONF → NOT → POSS`.
- Highlight: **CONF** green, **POSS** plain, **NOT** red.
- Keep **+** per column and delete control for editing the list.

```
┌──────────┬──────────┬──────────┬──────────┐
│ Townsfolk│ Outsider │ Minion   │ Demon    │
├──────────┼──────────┼──────────┼──────────┤
│ Washer…  │ Butler   │ Poisoner │ Imp      │  ← green/plain/red
│ Librarian│ Drunk    │ Spy      │          │
│ +        │ +        │ +        │ +        │
└──────────┴──────────┴──────────┴──────────┘
```

---

## 3. Auto player distribution

**Standard BotC count → {townsfolk, outsiders, minions, demons}** helper (e.g. in `type.tsx`), covering 5–15+ (e.g. 7→5/0/1/1, 10→7/0/2/1, 15→9/2/3/1).

**Same [`CharsTab.tsx`](src/components/tabs/CharsTab.tsx) distribution strip above the 4 columns:**
- Primary: **Players** count.
- Changing count **auto-sets** `roleDist`.
- TOWNS/OUTS/MINIONS/DEMON read-only by default.
- **Custom** toggle expands four rotaries for overrides.

---

## Files to touch

- [`src/type.tsx`](src/type.tsx), [`src/type.test.ts`](src/type.test.ts)
- [`src/hooks/useGameState.ts`](src/hooks/useGameState.ts)
- new `ScriptStatusSection.tsx`, [`PlayerDetailView.tsx`](src/components/PlayerDetailView.tsx), [`App.tsx`](src/App.tsx)
- [`CharsTab.tsx`](src/components/tabs/CharsTab.tsx) (4-col edit UI + dist)

## Out of scope (this plan)
- Editing Day N / Next day / frontier day
- Voting remaining chips
- Moving distribution onto the main player tab
- Removing Roles page edit/add (page stays the script editor)