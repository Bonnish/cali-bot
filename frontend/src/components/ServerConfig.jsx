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

            <h2 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '30px' }}>⚙️</span> Ajustes del Servidor
            </h2>

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
