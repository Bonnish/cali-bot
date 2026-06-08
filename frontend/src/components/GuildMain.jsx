import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import ServerAnalytics from './ServerAnalytics';

export default function GuildMain({ user }) {
    const { guildId } = useParams();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        API.get(`guilds/${guildId}/dashboard_stats/`)
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar las estadísticas del servidor.');
                setLoading(false);
            });
    }, [guildId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border-color)', borderTop: '5px solid var(--accent-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return <div style={{ color: 'var(--danger)', padding: '20px' }}>{error}</div>;
    }

    return (
        <div className="animate-fade-in" style={{ padding: '30px', maxWidth: '900px' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                {user?.avatar ? (
                    <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ width: '80px', borderRadius: '50%', border: '2px solid var(--accent-orange)' }} />
                ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--discord)' }} />
                )}
                <div>
                    <h2 style={{ margin: 0 }}>{user?.username}</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0', fontSize: '18px' }}>
                        Nivel actual: <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>{stats.level}</span> (XP: {stats.xp})
                    </p>
                </div>
            </div>

            <h3 style={{ marginBottom: '20px' }}>📈 Actividad de Mensajes</h3>
            <ServerAnalytics guildId={guildId} />

            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>📊 Estadísticas de la Semana</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--success)' }}>
                        {stats.new_members_this_week}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Nuevos Usuarios</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--danger)' }}>
                        {stats.bans_this_week}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Usuarios Baneados</div>
                </div>
            </div>
        </div>
    );
}
