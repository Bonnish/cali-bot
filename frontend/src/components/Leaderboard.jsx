import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Leaderboard() {
    const { guildId } = useParams();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        API.get(`guilds/${guildId}/leaderboard/`)
            .then(res => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudo cargar el ranking.');
                setLoading(false);
            });
    }, [guildId]);

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>#{index + 1}</span>;
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '900px', marginTop: '40px', paddingBottom: '60px' }}>
            <button onClick={() => navigate(`/dashboard/${guildId}`)} className="btn btn-secondary" style={{ marginBottom: '30px' }}>
                ← Volver a Configuración
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ fontSize: '32px', padding: '12px', backgroundColor: 'var(--accent-orange-glow)', borderRadius: '12px', color: 'var(--accent-orange)' }}>
                    🏆
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Ranking de Experiencia (XP)</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Los miembros más activos de tu comunidad.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--accent-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                    <h3 style={{ color: 'var(--text-muted)' }}>Cargando mejores usuarios...</h3>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <h3 style={{ color: 'var(--danger)' }}>{error}</h3>
                </div>
            ) : users.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>💤</div>
                    <h3 style={{ marginBottom: '10px' }}>Nadie ha ganado XP aún</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Asegúrate de que el sistema de XP esté activado y pide a tus usuarios que chateen.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center', width: '80px' }}>Top</th>
                                <th>Usuario</th>
                                <th style={{ textAlign: 'center' }}>Nivel</th>
                                <th>Progreso de XP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => {
                                const nextLevelXp = u.level * 500;
                                const progressPercent = Math.min(100, Math.max(0, (u.xp / nextLevelXp) * 100));

                                return (
                                    <tr key={u.user_id}>
                                        <td style={{ textAlign: 'center', fontSize: '24px' }}>
                                            {getMedal(idx)}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {u.avatar_url ? (
                                                    <img src={u.avatar_url} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                                                ) : (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--discord)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {u.username ? u.username.charAt(0).toUpperCase() : '?'}
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{u.username || 'Usuario Desconocido'}</div>
                                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {u.user_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span style={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                                                padding: '4px 10px', 
                                                borderRadius: '12px', 
                                                fontWeight: 'bold',
                                                color: 'white'
                                            }}>
                                                Lvl. {u.level}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px', height: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                                    <div style={{ 
                                                        width: `${progressPercent}%`, 
                                                        height: '100%', 
                                                        background: 'linear-gradient(90deg, var(--accent-orange), var(--accent-brown))',
                                                        borderRadius: '3px'
                                                    }} />
                                                </div>
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)', minWidth: '80px', textAlign: 'right' }}>
                                                    {u.xp} / {nextLevelXp} XP
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
