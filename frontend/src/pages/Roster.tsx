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
                onClick={() => {
                  if (window.confirm(`Remove ${p.name} from the roster? This cannot be undone.`)) {
                    deletePlayer(p.id);
                  }
                }}
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
