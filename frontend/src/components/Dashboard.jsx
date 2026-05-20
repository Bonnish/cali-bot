import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function Dashboard() {
    const GUILD_ID = "1314391978967961611"; 
    
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPrefix, setNewPrefix] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        API.get(`guilds/${GUILD_ID}/`)
            .then(res => {
                setConfig(res.data);
                setNewPrefix(res.data.prefix);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando la configuración:", err);
                setLoading(false);
            });
    }, []);

    // Enviar actualización (PUT) a la API
    const handleUpdatePrefix = (e) => {
        e.preventDefault();
        API.put(`guilds/${GUILD_ID}/`, { prefix: newPrefix })
            .then(res => {
                setConfig(res.data);
                setMessage("¡Prefijo actualizado con éxito!");
                setTimeout(() => setMessage(''), 3000);
            })
            .catch(err => {
                console.error("Error al actualizar:", err);
            });
    };

    if (loading) return <div style={{ padding: '20px', color: 'white' }}>Cargando panel...</div>;
    if (!config) return <div style={{ padding: '20px', color: 'red' }}>Error al conectar con el servidor.</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#1e1e24', color: '#fff', borderRadius: '8px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '40px auto' }}>
            <h2>🛡️ CaliBot Web Dashboard</h2>
            <p><strong>Server ID:</strong> {config.guild_id}</p>
            <p><strong>Idioma del Bot:</strong> {config.language === 'es' ? 'Español 🇪🇸' : 'Inglés 🇺🇸'}</p>
            
            <hr style={{ borderColor: '#333', margin: '20px 0' }} />

            <form onSubmit={handleUpdatePrefix}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Configurar Prefijo:</label>
                <input 
                    type="text" 
                    value={newPrefix} 
                    onChange={(e) => setNewPrefix(e.target.value)}
                    maxLength="5"
                    style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2d2d34', color: '#fff', width: '80px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', fontSize: '16px', backgroundColor: '#5865F2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Guardar
                </button>
            </form>

            {message && <p style={{ color: '#43b581', marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
}