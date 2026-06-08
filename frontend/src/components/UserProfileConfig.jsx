import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function UserProfileConfig({ user }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        API.get('users/me/')
            .then(res => {
                setProfile(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar tu perfil global.');
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        setError('');
        API.put('users/me/', { 
            rankcard_bg: profile.rankcard_bg,
            rankcard_color: profile.rankcard_color
        })
            .then(res => {
                setProfile(res.data);
                alert("¡Configuración guardada con éxito!");
            })
            .catch(err => {
                console.error(err);
                setError('Hubo un error al guardar tu configuración.');
            })
            .finally(() => {
                setSaving(false);
            });
    };

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
        <div className="animate-fade-in" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '30px' }}>👤</span> Configuración Global
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                Estos ajustes son universales y se aplicarán a tu perfil en todos los servidores donde CaliBot esté activo.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--warning)' }}>
                        🪙 {profile.credits}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Créditos Globales</div>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'var(--success)' }}>
                        ⭐ {profile.global_xp}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '10px' }}>XP Global Acumulada</div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '20px' }}>🖼️ Personalizar RankCard</h3>
                
                {/* Mockup visual de la RankCard renderizado exactamente igual a Discord usando SVG */}
                <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                    <svg viewBox="0 0 900 280" style={{ width: '100%', display: 'block' }}>
                        <defs>
                            <linearGradient id="cali-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#ff7b00" />
                                <stop offset="100%" stopColor="#a0522d" />
                            </linearGradient>
                            <clipPath id="avatar-clip">
                                <circle cx="130" cy="140" r="90" />
                            </clipPath>
                        </defs>
                        
                        {/* Background */}
                        <rect width="900" height="280" fill={profile.rankcard_bg === 'dark' ? '#000000' : profile.rankcard_bg === 'cali' ? 'url(#cali-grad)' : '#18191c'} />

                        {/* Avatar Ring */}
                        <circle cx="130" cy="140" r="97" fill="none" stroke={profile.rankcard_color || '#2ecc71'} strokeWidth="6" />
                        
                        {/* Avatar */}
                        <image 
                            href={user?.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'} 
                            x="40" y="50" width="180" height="180" 
                            clipPath="url(#avatar-clip)" 
                            preserveAspectRatio="xMidYMid slice" 
                        />
                        
                        {/* Texts */}
                        <text x="270" y="55" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="45" fontWeight="bold" dominantBaseline="hanging">
                            {user?.username}
                        </text>

                        {/* Level Badge */}
                        <rect x="270" y="115" width="160" height="40" rx="8" fill={profile.rankcard_color || '#2ecc71'} />
                        <text x="285" y="122" fill="#000000" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="bold" dominantBaseline="hanging">
                            NIVEL 15
                        </text>

                        <text x="840" y="122" fill="#c8c8c8" fontFamily="Arial, sans-serif" fontSize="26" textAnchor="end" dominantBaseline="hanging">
                            4200 / 5000 XP
                        </text>

                        {/* Progress Bars */}
                        <rect x="270" y="180" width="570" height="35" rx="17.5" fill="rgba(0, 0, 0, 0.7)" />
                        <rect x="270" y="180" width="478.8" height="35" rx="17.5" fill={profile.rankcard_color || '#2ecc71'} />
                    </svg>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                        <label className="input-label">Fondo de Tarjeta</label>
                        <select 
                            name="rankcard_bg" 
                            value={profile.rankcard_bg || 'default'} 
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="default">Clásico Oscuro (Por Defecto)</option>
                            <option value="dark">Negro Profundo</option>
                            <option value="cali">CaliBot Naranja (Premium)</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Color de Acento</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input 
                                type="color" 
                                name="rankcard_color" 
                                value={profile.rankcard_color || '#2ecc71'} 
                                onChange={handleChange}
                                style={{ width: '50px', height: '45px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
                            />
                            <span style={{ color: 'var(--text-muted)' }}>Elige un color para la barra y nivel</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '16px' }}
                >
                    {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}
