import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Leaderboard() {
    const { guildId } = useParams();
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        API.get(`guilds/${guildId}/`)
            .then(res => setConfig(res.data))
            .catch(err => console.error(err));

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        API.put(`guilds/${guildId}/`, config)
            .then(res => {
                setConfig(res.data);
                alert("¡Configuración guardada con éxito!");
            })
            .catch(err => console.error(err))
            .finally(() => setSaving(false));
    };

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
                    <h2 style={{ margin: 0 }}>Sistema de Niveles & XP</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Configura el progreso y recompensas de tu comunidad.</p>
                </div>
            </div>

            {/* XP Config Section */}
            {config && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '20px' }}>⚙️ Ajustes del Módulo</h3>
                    
                    {/* XP Habilitado (Toggle Switch) */}
                    <div className="input-group">
                        <label className="toggle-wrapper">
                            <input 
                                type="checkbox" 
                                name="xp_enabled" 
                                checked={config.xp_enabled || false} 
                                onChange={handleChange}
                                className="toggle-input"
                            />
                            <div className="toggle-switch"></div>
                            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Habilitar ganancia de XP en el servidor</span>
                        </label>
                    </div>

                    {/* XP por mensaje */}
                    <div className="input-group" style={{ opacity: config.xp_enabled ? 1 : 0.5, pointerEvents: config.xp_enabled ? 'auto' : 'none', transition: 'all 0.3s' }}>
                        <label className="input-label">XP Base por Mensaje</label>
                        <input 
                            type="number" 
                            name="xp_per_message" 
                            value={config.xp_per_message || ''} 
                            onChange={handleChange}
                            min="1"
                            max="100"
                            className="input-field"
                        />
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                            Cantidad aproximada de XP otorgada aleatoriamente cada vez que un usuario escribe un mensaje.
                        </p>
                    </div>

                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px', padding: '12px' }}
                    >
                        {saving ? 'Guardando...' : '💾 Guardar Ajustes de XP'}
                    </button>
                </div>
            )}

            {/* Leaderboard Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>🏅 Tabla de Clasificación Global</h3>
                <button 
                    onClick={() => setShowLeaderboard(!showLeaderboard)} 
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                    {showLeaderboard ? 'Ocultar Leaderboard' : 'Ver Leaderboard Público'}
                </button>
            </div>

            {/* Leaderboard Display */}
            {showLeaderboard && (
                <>

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
            </>
            )}
        </div>
    );
}
