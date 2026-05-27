# Frontend Polish — Design Spec
_Date: 2026-05-27_

## Goal

Elevate SoccerTrack's frontend from a working app to a polished, premium-feeling product — the visual register of FPL or ESPN Fantasy. No new backend features; all changes are visual and structural.

---

## 1. Color System Overhaul

Replace the current "soft dark" palette with a higher-contrast, more saturated "FPL Vivid" palette.

### Token changes in `index.css` (`:root`)

| Token | Before | After | Why |
|---|---|---|---|
| `--bg` | `#090910` | `#03030a` | Near-pure black — makes accents pop harder |
| `--bg-surface` | `#0f0f18` | `#090914` | Deeper surface layer |
| `--bg-card` | `#16161f` | `#111120` | More contrast vs background |
| `--bg-card-hover` | `#1c1c27` | `#17172a` | Keeps hover delta consistent |
| `--bg-elevated` | `#21212e` | `#1c1c30` | |
| `--red` | `#c0272d` | `#cc0015` | Richer, deeper red |
| `--red-light` | `#e63946` | `#ff2d3d` | Vivid — the FPL "active" red |
| `--red-glow` | `rgba(230,57,70,0.25)` | `rgba(255,45,61,0.3)` | More saturated glow |
| `--red-gradient` | `135deg, #c0272d … #e63946` | `135deg, #cc0015 … #ff2d3d` | |
| `--green` | `#22c55e` | `#00e676` | Electric green — stadium scoreboard feel |
| `--green-dim` | `rgba(34,197,94,0.12)` | `rgba(0,230,118,0.12)` | |
| `--green-glow` | `rgba(34,197,94,0.25)` | `rgba(0,230,118,0.3)` | |
| `--text-heading` | `#f0f0fa` | `#ffffff` | Pure white — maximum contrast |
| `--border-strong` | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.12)` | Slightly more defined |
| `--nav-border` | `rgba(192,39,45,0.2)` | `rgba(255,45,61,0.45)` | More vivid nav underline |

Shadow tokens: increase opacity by ~15% across `--shadow-md`, `--shadow-lg`, `--shadow-xl`, `--shadow-red`.

---

## 2. Typography — Oswald + Inter

### Font import (replace current `@import` in `index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
```

### New token

```css
--display: 'Oswald', 'Arial Narrow', sans-serif;
```

### Where Oswald applies (all-caps + letter-spacing already there — just swap the font)

- `.nav-brand` — brand logotype
- `.nav a:not(.nav-brand)` — nav links
- `.page h1` — all page headings
- `.btn` — all buttons
- `.game-location` — HOME / AWAY badges
- `.game-link` — SETUP / TRACK links
- `.player-card .card-badge` — position badge (FWD, MID, DEF, GK)
- `.bench-panel .bench-title` — BENCH header
- `.stats-table th` — column headers
- `.section-label` — section dividers
- `.team-switcher-btn` — team button
- `.team-dropdown-label` — dropdown section label
- `.clock-final` — FINAL clock state
- `.empty-state-title` — empty state headings

Inter stays on everything else: body copy, player names, input fields, dropdown items.

---

## 3. Collapsed Forms

Both `Games.tsx` and `Roster.tsx` currently render the add-form unconditionally at the top of the page. Replace with a toggle pattern.

### Pattern

```tsx
const [showForm, setShowForm] = useState(false);

// Page header:
<div className="page-header">
  <h1>Games</h1>
  <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
    {showForm ? 'Cancel' : '+ New Game'}
  </button>
</div>

// Conditional form:
{showForm && (
  <div className="add-form-card">
    <p className="add-form-label">SCHEDULE A GAME</p>
    <form onSubmit={handleSubmit} className="form-row">
      {/* existing inputs */}
      <button type="submit" className="btn btn-primary">Add Game</button>
      <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
    </form>
  </div>
)}
```

### New CSS classes needed in `index.css`

```css
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h1 { margin: 0; }

.add-form-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 45, 61, 0.2);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  margin-bottom: 20px;
  animation: pageFadeIn 0.2s var(--ease) both;
}
.add-form-label {
  font-family: var(--display);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin: 0 0 12px;
  text-transform: uppercase;
}
```

Apply the same pattern to `Roster.tsx` (`+ Add Player` / `ADD A PLAYER`).

---

## 4. Roster Cleanup + Delete

### Remove duplicate jersey display

In `Roster.tsx`, the `roster-item` currently shows:
- Red circle with jersey number
- `roster-info` block with name AND "No. {jersey_number}"

**Remove** the `<span className="roster-number">No. {p.jersey_number}</span>` line. The circle badge is sufficient.

### Add delete button

Add a `✕` button that calls `DELETE /api/players/{id}/`. Button is low-opacity at rest, full red on hover — discoverable but not aggressive.

```tsx
async function deletePlayer(id: number) {
  await api.DELETE('/api/players/{id}/', { params: { path: { id } } });
  load();
}

// In roster-item:
<button className="roster-delete" onClick={() => deletePlayer(p.id)} title="Remove player">✕</button>
```

```css
.roster-delete {
  margin-left: auto;
  background: transparent;
  border: 1px solid transparent;
  color: var(--red-light);
  opacity: 0.25;
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  font-size: 0.72rem;
  cursor: pointer;
  transition: opacity 0.2s var(--ease), border-color 0.2s, background 0.2s;
  font-family: var(--sans);
}
.roster-item:hover .roster-delete {
  opacity: 0.7;
}
.roster-delete:hover {
  opacity: 1 !important;
  background: rgba(255, 45, 61, 0.08);
  border-color: rgba(255, 45, 61, 0.25);
}
```

---

## 5. Code Consistency — Replace Inline Styles

### `GameSummary.tsx` line 136

```tsx
// Before
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>

// After
<div className="page-header">
```

### `Stats.tsx` and `GameSummary.tsx` surface divs

Both pages have:
```tsx
<div className="surface" style={{ overflowX: 'auto', padding: 0 }}>
```

Move `overflowX: 'auto'` and `padding: 0` into a modifier class:
```css
.surface-scroll { overflow-x: auto; padding: 0; }
```
Then use `className="surface surface-scroll"` in both files.

---

## Files Changed

| File | Changes |
|---|---|
| `frontend/src/index.css` | Color tokens, font import + `--display` token, Oswald on display elements, new `.page-header`, `.add-form-card`, `.add-form-label`, `.roster-delete` |
| `frontend/src/pages/Games.tsx` | Collapsed form with `showForm` toggle |
| `frontend/src/pages/Roster.tsx` | Collapsed form, remove duplicate jersey text, add delete button |
| `frontend/src/pages/GameSummary.tsx` | `style={{}}` → `className="page-header"` |
| `frontend/src/pages/Stats.tsx` | Audit + replace any remaining inline styles |

---

## Out of Scope

- No backend changes
- No new data fields (score, position on player, etc.)
- No mobile/responsive work
- No new pages or routes
