import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ServerAnalytics from './ServerAnalytics';

export default function ServerConfig() {
    const { guildId } = useParams();
    const navigate = useNavigate();
    
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        API.get(`guilds/${guildId}/`)
            .then(res => {
                setConfig(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar la configuración. Asegúrate de que el bot esté en el servidor y recarga.');
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
        setError('');
        API.put(`guilds/${guildId}/`, config)
            .then(res => {
                setConfig(res.data);
                alert("¡Configuración guardada con éxito!");
            })
            .catch(err => {
                console.error(err);
                setError('Hubo un error al guardar la configuración.');
            })
            .finally(() => {
                setSaving(false);
            });
    };

    if (loading) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{ width: '50px', height: '50px', border: '5px solid var(--border-color)', borderTop: '5px solid var(--accent-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                <h3 style={{ color: 'var(--text-muted)' }}>Cargando configuración...</h3>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '100px', maxWidth: '500px' }}>
                <div className="card">
                    <h2 style={{ color: 'var(--danger)', marginBottom: '15px' }}>⚠️ Error de Conexión</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '25px', lineHeight: '1.5' }}>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Volver al Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '650px', marginTop: '40px', paddingBottom: '60px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
                    ← Volver
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate(`/dashboard/${guildId}/leaderboard`)} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-brown))' }}>
                        🏆 Ranking XP
                    </button>
                    <button onClick={() => navigate(`/dashboard/${guildId}/infractions`)} className="btn btn-primary" style={{ background: 'var(--danger)' }}>
                        📜 Moderación
                    </button>
                </div>
            </div>

            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '30px' }}>⚙️</span> Ajustes del Servidor
            </h2>

            <ServerAnalytics guildId={guildId} />

            <div className="card">
                
                {/* Prefix */}
                <div className="input-group">
                    <label className="input-label">Prefijo del Bot</label>
                    <input 
                        type="text" 
                        name="prefix" 
                        value={config.prefix || ''} 
                        onChange={handleChange}
                        maxLength="5"
                        className="input-field"
                        placeholder="Ejemplo: !"
                    />
                </div>

                {/* Idioma */}
                <div className="input-group">
                    <label className="input-label">Idioma Principal</label>
                    <select 
                        name="language" 
                        value={config.language || 'en'} 
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option value="en">Inglés (English)</option>
                        <option value="es">Español</option>
                    </select>
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '30px 0' }} />

                <h3 style={{ marginBottom: '20px' }}>✨ Sistema de Niveles</h3>

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
                        <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Habilitar ganancia de XP</span>
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
                    style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '16px' }}
                >
                    {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                </button>
            </div>
        </div>
    );
}
