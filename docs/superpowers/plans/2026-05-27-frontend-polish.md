# Frontend Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate SoccerTrack's visual polish to a premium FPL-style sports product — deeper colors, Oswald display font, collapsed add-forms, clean roster, and zero inline styles.

**Architecture:** All changes are in the frontend only. CSS token changes cascade automatically. Component changes (Games, Roster) add a `showForm` boolean state to toggle the add-form. No new API endpoints required; player delete uses the existing `DELETE /api/players/{id}/` endpoint.

**Tech Stack:** React 19, TypeScript, Vite, plain CSS custom properties, Google Fonts (Oswald + Inter + JetBrains Mono)

---

## File Map

| File | What changes |
|---|---|
| `frontend/src/index.css` | Color tokens, font import, `--display` token, Oswald on display elements, new utility classes |
| `frontend/src/pages/Games.tsx` | Collapsed form with `showForm` toggle |
| `frontend/src/pages/Roster.tsx` | Collapsed form, remove duplicate jersey text, delete button |
| `frontend/src/pages/GameSummary.tsx` | Replace inline `style={{}}` with CSS classes |
| `frontend/src/pages/Stats.tsx` | Replace inline `style={{}}` on surface div |

---

## Task 1: Color Tokens + Shadow Depth

**Files:**
- Modify: `frontend/src/index.css:1-52` (`:root` block) and `frontend/src/index.css:78-92` (`.nav` rule)

- [ ] **Step 1: Replace the `@import` line and the full `:root` block**

Open `frontend/src/index.css`. Replace lines 1–52 (from `@import` through the closing `}` of `:root`) with:

```css
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

:root {
  --bg: #03030a;
  --bg-surface: #090914;
  --bg-card: #111120;
  --bg-card-hover: #17172a;
  --bg-elevated: #1c1c30;

  --red: #cc0015;
  --red-light: #ff2d3d;
  --red-glow: rgba(255, 45, 61, 0.3);
  --red-dark: #8b1a1f;
  --red-gradient: linear-gradient(135deg, #cc0015 0%, #ff2d3d 100%);
  --red-subtle: rgba(204, 0, 21, 0.08);
  --gold: #ffd700;
  --gold-dim: rgba(255, 215, 0, 0.12);
  --gold-glow: rgba(255, 215, 0, 0.3);
  --green: #00e676;
  --green-dim: rgba(0, 230, 118, 0.12);
  --green-glow: rgba(0, 230, 118, 0.3);

  --text: #c8c8d8;
  --text-muted: #62627a;
  --text-heading: #ffffff;
  --border: rgba(255, 255, 255, 0.05);
  --border-strong: rgba(255, 255, 255, 0.12);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.70);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.75);
  --shadow-lg: 0 8px 28px rgba(0, 0, 0, 0.85);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.92);
  --shadow-red: 0 4px 20px rgba(255, 45, 61, 0.50);
  --shadow-glow: 0 0 40px rgba(255, 45, 61, 0.15);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-pill: 50px;

  --ease: cubic-bezier(0.4, 0, 0.2, 1);

  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;
  --display: 'Oswald', 'Arial Narrow', sans-serif;

  font: 15px/1.5 var(--sans);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 2: Update the `.nav` border and shadow to use vivid red**

Find the `.nav` rule (around line 78). Update only the `border-bottom` and `box-shadow` lines:

```css
.nav {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 24px;
  background: rgba(3, 3, 10, 0.96);
  border-bottom: 1px solid rgba(255, 45, 61, 0.45);
  height: 58px;
  position: sticky;
  top: 0;
  z-index: 100;
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
  box-shadow: 0 1px 0 rgba(255, 45, 61, 0.12), 0 4px 24px rgba(0, 0, 0, 0.6);
}
```

- [ ] **Step 3: Verify TypeScript and build pass**

```bash
cd frontend && npm run build
```

Expected: build completes with no errors (CSS-only change, TypeScript unaffected).

- [ ] **Step 4: Commit**

```bash
cd frontend && git add src/index.css
git commit -m "style: vivid color tokens — deeper black, #ff2d3d red, #00e676 green"
```

---

## Task 2: Typography — Oswald Display Font

**Files:**
- Modify: `frontend/src/index.css` — add `font-family: var(--display)` to all display-role selectors

- [ ] **Step 1: Add `font-family: var(--display)` to `.nav-brand` and nav links**

Find `.nav-brand` (around line 93). Add the font-family line:

```css
.nav-brand {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-right: 36px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-heading);
  text-decoration: none;
  transition: opacity 0.2s var(--ease);
}
```

Find `.nav a:not(.nav-brand)` (around line 116). Add the font-family line:

```css
.nav a:not(.nav-brand) {
  font-family: var(--display);
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 8px 16px;
  margin: 0 2px;
  border-radius: var(--radius-sm);
  border-bottom: 2px solid transparent;
  transition: color 0.2s var(--ease), background 0.2s var(--ease), border-color 0.2s var(--ease);
  position: relative;
}
```

- [ ] **Step 2: Add `font-family: var(--display)` to page headings and buttons**

Find `.page h1` (around line 289). Add the font-family:

```css
.page h1 {
  font-family: var(--display);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-heading);
  margin: 0 0 24px;
  text-transform: uppercase;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 14px;
}
```

Find `.btn` (around line 367). Add the font-family (replacing `font-family: var(--sans)` if present):

```css
.btn {
  padding: 10px 24px;
  border: none;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 0.85rem;
  font-family: var(--display);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  transition: all 0.2s var(--ease);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 3: Add Oswald to badge, label, and table header elements**

Find each selector and add `font-family: var(--display)`. Make only the `font-family` addition — leave all other properties unchanged:

**`.game-location`** (around line 1321):
```css
.game-location {
  font-family: var(--display);
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 3px 9px;
  border-radius: 4px;
  line-height: 1;
  flex-shrink: 0;
}
```

**`.game-link`** (around line 1344):
```css
.game-link {
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  transition: all 0.2s var(--ease);
  white-space: nowrap;
}
```

**`.player-card .card-badge`** (around line 702):
```css
.player-card .card-badge {
  font-family: var(--display);
  background: var(--red-gradient);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  padding: 4px 0;
  width: 100%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 0 rgba(0, 0, 0, 0.25);
}
```

**`.bench-panel .bench-title`** (around line 872):
```css
.bench-panel .bench-title {
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-heading);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

**`.stats-table th`** (around line 1128):
```css
.stats-table th {
  font-family: var(--display);
  padding: 14px 8px;
  font-weight: 700;
  border-bottom: 2px solid var(--red);
  background: linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%);
  color: var(--text-heading);
  text-align: center;
  position: sticky;
  top: 0;
  text-transform: uppercase;
  font-size: 0.72rem;
  letter-spacing: 1.4px;
  z-index: 2;
  box-shadow: 0 2px 16px var(--red-glow);
}
```

**`.section-label`** (around line 1430):
```css
.section-label {
  font-family: var(--display);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 0 0 10px;
}
```

**`.team-switcher-btn`** (around line 148):
```css
.team-switcher-btn {
  font-family: var(--display);
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  color: var(--text-heading);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 14px;
  border-radius: var(--radius-pill);
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
```

**`.team-dropdown-label`** (around line 197):
```css
.team-dropdown-label {
  font-family: var(--display);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 6px 10px 8px;
}
```

**`.clock-final`** (around line 969):
```css
.clock-final {
  font-family: var(--display);
  font-weight: 700;
  color: var(--red-light);
  text-transform: uppercase;
  font-size: 1.1rem;
  letter-spacing: 3px;
  text-shadow: 0 0 20px var(--red-glow);
}
```

**`.empty-state-title`** (around line 505):
```css
.empty-state-title {
  font-family: var(--display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
```

- [ ] **Step 4: Verify build passes**

```bash
cd frontend && npm run build
```

Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
cd frontend && git add src/index.css
git commit -m "style: Oswald display font on nav, headings, badges, buttons, labels"
```

---

## Task 3: New Utility CSS Classes

**Files:**
- Modify: `frontend/src/index.css` — append new rules at the end of the UTILITY section (around line 1440)

- [ ] **Step 1: Add `.page-header` and `.add-form-card` classes**

Append after the last rule in `index.css` (after the `.flex-center` line):

```css
/* ══════════════════════════════════════════
   PAGE HEADER (title + action button row)
   ══════════════════════════════════════════ */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-header h1 { margin: 0; }

/* ══════════════════════════════════════════
   ADD FORM CARD (collapsible form panel)
   ══════════════════════════════════════════ */
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
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--text-muted);
  margin: 0 0 12px;
  text-transform: uppercase;
}

/* ══════════════════════════════════════════
   SURFACE SCROLL MODIFIER
   ══════════════════════════════════════════ */
.surface-scroll {
  overflow-x: auto;
  padding: 0;
}

/* ══════════════════════════════════════════
   ROSTER DELETE BUTTON
   ══════════════════════════════════════════ */
.roster-delete {
  margin-left: auto;
  background: transparent;
  border: 1px solid transparent;
  color: var(--red-light);
  opacity: 0.2;
  border-radius: var(--radius-sm);
  padding: 4px 9px;
  font-size: 0.78rem;
  cursor: pointer;
  transition: opacity 0.2s var(--ease), border-color 0.2s var(--ease), background 0.2s var(--ease);
  font-family: var(--sans);
  line-height: 1;
}
.roster-item:hover .roster-delete {
  opacity: 0.55;
}
.roster-delete:hover {
  opacity: 1 !important;
  background: rgba(255, 45, 61, 0.08);
  border-color: rgba(255, 45, 61, 0.25);
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd frontend && npm run build
```

Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/index.css
git commit -m "style: add .page-header, .add-form-card, .surface-scroll, .roster-delete utility classes"
```

---

## Task 4: Games.tsx — Collapsed Add-Form

**Files:**
- Modify: `frontend/src/pages/Games.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { components } from '../api/schema';
import { useTeam } from '../state/team';

type Game = components['schemas']['Game'];

export default function Games() {
  const { activeTeam } = useTeam();
  const [games, setGames] = useState<Game[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState<'home' | 'away'>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!activeTeam) return;
    setLoading(true);
    const { data, error } = await api.GET('/api/games/', {
      params: { query: { team: activeTeam.id } as never },
    });
    if (error) {
      setError('Failed to load games');
    } else {
      setGames(data ?? []);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam?.id]);

  async function addGame(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTeam) {
      setError('Select a team first.');
      return;
    }
    if (!opponent.trim() || !date) {
      setError('Opponent and date are required.');
      return;
    }
    const { error } = await api.POST('/api/games/', {
      body: { team: activeTeam.id, date, opponent: opponent.trim(), location } as never,
    });
    if (error) {
      setError('Failed to create game');
      return;
    }
    setOpponent('');
    setDate('');
    setLocation('home');
    setShowForm(false);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Games</h1>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(v => !v); setError(null); }}
        >
          {showForm ? 'Cancel' : '+ New Game'}
        </button>
      </div>

      {showForm && (
        <div className="add-form-card">
          <p className="add-form-label">Schedule a Game</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={addGame} className="form-row" style={{ marginBottom: 0 }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: 150 }}
            />
            <input
              placeholder="Opponent"
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              style={{ flex: 1, minWidth: 120 }}
            />
            <select value={location} onChange={(e) => setLocation(e.target.value as 'home' | 'away')}>
              <option value="home">Home</option>
              <option value="away">Away</option>
            </select>
            <button type="submit" className="btn btn-primary">Add Game</button>
          </form>
        </div>
      )}

      {!showForm && error && <p className="error">{error}</p>}

      <div className="surface">
        {loading ? (
          <div className="loading">Loading games…</div>
        ) : games.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🏟️</span>
            <div className="empty-state-title">No Games Yet</div>
            <p>Hit <strong>+ New Game</strong> above to schedule your first match.</p>
          </div>
        ) : (
          games.map((g) => (
            <div key={g.id} className={`game-row ${g.location}`}>
              <span className="game-date">{g.date}</span>
              <span className={`game-location ${g.location}`}>
                {g.location === 'home' ? 'Home' : 'Away'}
              </span>
              <span className="game-opponent">
                <span className="game-vs">{g.location === 'home' ? 'vs' : '@'}</span>
                {g.opponent}
              </span>
              <div className="game-actions">
                <Link to={`/games/${g.id}/setup`} className="game-link">Setup</Link>
                <Link to={`/games/${g.id}/tracker`} className="game-link primary">Track</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/pages/Games.tsx
git commit -m "feat: collapse add-game form behind + New Game toggle"
```

---

## Task 5: Roster.tsx — Collapsed Form + Delete + Cleanup

**Files:**
- Modify: `frontend/src/pages/Roster.tsx`

- [ ] **Step 1: Replace the entire file content**

```tsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { components } from '../api/schema';
import { useTeam } from '../state/team';

type Player = components['schemas']['Player'];

export default function Roster() {
  const { activeTeam } = useTeam();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [jersey, setJersey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!activeTeam) return;
    setLoading(true);
    const { data, error } = await api.GET('/api/players/', {
      params: { query: { team: activeTeam.id } as never },
    });
    if (error) {
      setError('Failed to load players');
    } else {
      setPlayers(data ?? []);
      setError(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam?.id]);

  async function addPlayer(e: React.FormEvent) {
    e.preventDefault();
    if (!activeTeam) {
      setError('Select a team first.');
      return;
    }
    const jerseyNum = Number(jersey);
    if (!name.trim() || !Number.isInteger(jerseyNum) || jerseyNum < 0) {
      setError('Name and a non-negative jersey number are required.');
      return;
    }
    const { error } = await api.POST('/api/players/', {
      body: { team: activeTeam.id, name: name.trim(), jersey_number: jerseyNum } as never,
    });
    if (error) {
      setError('Failed to create player');
      return;
    }
    setName('');
    setJersey('');
    setShowForm(false);
    load();
  }

  async function deletePlayer(id: number) {
    const { error } = await api.DELETE('/api/players/{id}/', {
      params: { path: { id } },
    });
    if (error) {
      setError('Failed to delete player');
      return;
    }
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Roster</h1>
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(v => !v); setError(null); }}
        >
          {showForm ? 'Cancel' : '+ Add Player'}
        </button>
      </div>

      {showForm && (
        <div className="add-form-card">
          <p className="add-form-label">Add a Player</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={addPlayer} className="form-row" style={{ marginBottom: 0 }}>
            <input
              placeholder="Jersey #"
              value={jersey}
              onChange={(e) => setJersey(e.target.value)}
              style={{ width: 80 }}
            />
            <input
              placeholder="Player Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, minWidth: 120 }}
            />
            <button type="submit" className="btn btn-primary">Add Player</button>
          </form>
        </div>
      )}

      {!showForm && error && <p className="error">{error}</p>}

      <div className="surface">
        {loading ? (
          <div className="loading">Loading roster…</div>
        ) : players.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">👥</span>
            <div className="empty-state-title">Squad is Empty</div>
            <p>Hit <strong>+ Add Player</strong> above to build the roster.</p>
          </div>
        ) : (
          players.map((p) => (
            <div key={p.id} className="roster-item">
              <span className="roster-jersey">{p.jersey_number}</span>
              <div className="roster-info">
                <span className="roster-name">{p.name}</span>
              </div>
              <button
                className="roster-delete"
                onClick={() => deletePlayer(p.id)}
                title="Remove player"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/pages/Roster.tsx
git commit -m "feat: collapse add-player form, remove duplicate jersey text, add delete button"
```

---

## Task 6: Replace Inline Styles — GameSummary + Stats

**Files:**
- Modify: `frontend/src/pages/GameSummary.tsx:136`
- Modify: `frontend/src/pages/Stats.tsx:227`
- Modify: `frontend/src/pages/GameSummary.tsx:148`

- [ ] **Step 1: Fix `GameSummary.tsx` header div (line 136)**

Find this block in `GameSummary.tsx`:

```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
  <h1 style={{ margin: 0 }}>Game Summary</h1>
  <Link to={`/games/${gameId}/tracker`} className="game-link">← Back to Tracker</Link>
</div>
```

Replace with:

```tsx
<div className="page-header">
  <h1>Game Summary</h1>
  <Link to={`/games/${gameId}/tracker`} className="game-link">← Back to Tracker</Link>
</div>
```

- [ ] **Step 2: Fix `GameSummary.tsx` surface div (line 148)**

Find:

```tsx
<div className="surface" style={{ overflowX: 'auto', padding: 0 }}>
```

Replace with:

```tsx
<div className="surface surface-scroll">
```

- [ ] **Step 3: Fix `Stats.tsx` surface div**

In `Stats.tsx`, find:

```tsx
<div className="surface" style={{ overflowX: 'auto', padding: 0 }}>
```

Replace with:

```tsx
<div className="surface surface-scroll">
```

- [ ] **Step 4: Verify TypeScript compiles cleanly**

```bash
cd frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Full build check**

```bash
cd frontend && npm run build
```

Expected: build completes with 0 errors, 0 type errors.

- [ ] **Step 6: Commit**

```bash
cd frontend && git add src/pages/GameSummary.tsx src/pages/Stats.tsx
git commit -m "style: replace inline styles with .page-header and .surface-scroll classes"
```

---

## Final Verification

- [ ] **Start the dev server and visually verify each page**

```bash
cd frontend && npm run dev
```

Open http://localhost:5173 and check:

1. **Nav** — brand and nav links use Oswald, red underline is vivid, background near-black
2. **Games page** — h1 uses Oswald, `+ New Game` button shows/hides form, HOME badge is electric green, TRACK button glows red
3. **Roster page** — `+ Add Player` toggle works, player rows show jersey circle + name only (no "No. X"), hovering a row reveals `✕` button
4. **Stats page** — table headers use Oswald, no horizontal scroll style prop warning in console
5. **Game Summary** — header row is flex-between, no console style warnings

- [ ] **Final commit if any last tweaks were made**

```bash
cd frontend && git add -A && git commit -m "style: frontend polish — vivid palette, Oswald font, collapsed forms, clean roster"
```
