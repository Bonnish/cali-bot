import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AutoMessages() {
    const { guildId } = useParams();
    const navigate = useNavigate();

    const [config, setConfig] = useState(null);
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('welcome');

    useEffect(() => {
        Promise.all([
            API.get(`guilds/${guildId}/auto-messages/`),
            API.get(`guilds/${guildId}/channels/`)
        ]).then(([configRes, channelsRes]) => {
            setConfig(configRes.data);
            setChannels(channelsRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
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
        API.put(`guilds/${guildId}/auto-messages/`, config)
            .then(res => {
                setConfig(res.data);
                alert("¡Configuración guardada!");
            })
            .catch(err => console.error(err))
            .finally(() => setSaving(false));
    };

    if (loading) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--accent-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                <h3 style={{ color: 'var(--text-muted)' }}>Cargando módulo...</h3>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '800px', marginTop: '40px', paddingBottom: '60px' }}>
            <button onClick={() => navigate(`/dashboard/${guildId}`)} className="btn btn-secondary" style={{ marginBottom: '30px' }}>
                ← Volver a Configuración
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ fontSize: '32px', padding: '12px', backgroundColor: 'var(--accent-orange-glow)', borderRadius: '12px', color: 'var(--accent-orange)' }}>
                    💬
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Mensajes Automáticos</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Da la bienvenida y despide a los usuarios automáticamente.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button 
                    onClick={() => setActiveTab('welcome')} 
                    className={`btn ${activeTab === 'welcome' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                >
                    👋 Mensaje de Bienvenida
                </button>
                <button 
                    onClick={() => setActiveTab('goodbye')} 
                    className={`btn ${activeTab === 'goodbye' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                >
                    🚪 Mensaje de Despedida
                </button>
            </div>

            <div className="card">
                {activeTab === 'welcome' && (
                    <div className="animate-fade-in">
                        <div className="input-group">
                            <label className="toggle-wrapper">
                                <input 
                                    type="checkbox" 
                                    name="welcome_enabled" 
                                    checked={config?.welcome_enabled || false} 
                                    onChange={handleChange}
                                    className="toggle-input"
                                />
                                <div className="toggle-switch"></div>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Habilitar Bienvenidas</span>
                            </label>
                        </div>

                        <div style={{ opacity: config?.welcome_enabled ? 1 : 0.5, pointerEvents: config?.welcome_enabled ? 'auto' : 'none', transition: 'all 0.3s' }}>
                            <div className="input-group">
                                <label className="input-label">Canal de Bienvenida</label>
                                <select 
                                    name="welcome_channel_id" 
                                    value={config?.welcome_channel_id || ''} 
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">-- Selecciona un canal --</option>
                                    {channels.map(ch => (
                                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Mensaje Personalizado</label>
                                <textarea 
                                    name="welcome_message" 
                                    value={config?.welcome_message || ''} 
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="4"
                                    placeholder="¡Hola {user}, bienvenido a {server}!"
                                />
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                    Variables: <code>{'{user}'}</code> (mención), <code>{'{server}'}</code> (nombre del servidor).
                                </p>
                            </div>

                            <div className="input-group">
                                <label className="toggle-wrapper">
                                    <input 
                                        type="checkbox" 
                                        name="welcome_image_enabled" 
                                        checked={config?.welcome_image_enabled ?? true} 
                                        onChange={handleChange}
                                        className="toggle-input"
                                    />
                                    <div className="toggle-switch"></div>
                                    <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Adjuntar Tarjeta de Bienvenida (Imagen)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'goodbye' && (
                    <div className="animate-fade-in">
                        <div className="input-group">
                            <label className="toggle-wrapper">
                                <input 
                                    type="checkbox" 
                                    name="goodbye_enabled" 
                                    checked={config?.goodbye_enabled || false} 
                                    onChange={handleChange}
                                    className="toggle-input"
                                />
                                <div className="toggle-switch"></div>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>Habilitar Despedidas</span>
                            </label>
                        </div>

                        <div style={{ opacity: config?.goodbye_enabled ? 1 : 0.5, pointerEvents: config?.goodbye_enabled ? 'auto' : 'none', transition: 'all 0.3s' }}>
                            <div className="input-group">
                                <label className="input-label">Canal de Despedida</label>
                                <select 
                                    name="goodbye_channel_id" 
                                    value={config?.goodbye_channel_id || ''} 
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="">-- Selecciona un canal --</option>
                                    {channels.map(ch => (
                                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="input-label">Mensaje Personalizado</label>
                                <textarea 
                                    name="goodbye_message" 
                                    value={config?.goodbye_message || ''} 
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="4"
                                    placeholder="¡{user} nos ha dejado!"
                                />
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                                    Variables: <code>{'{user}'}</code> (nombre de usuario).
                                </p>
                            </div>
                        </div>
                    </div>
                )}

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
