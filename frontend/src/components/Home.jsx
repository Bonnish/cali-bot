import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
    const ENLACE_INVITACION_GLOBAL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot`;

    return (
        <div style={{ maxWidth: '900px', margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif', color: 'white', padding: '0 20px' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '10px' }}>🛡️ CaliBot</h1>
            <p style={{ fontSize: '20px', color: '#b9bbbe', marginBottom: '40px' }}>
                Un bot de Discord escalable y multiservidor equipado con sistema de niveles (XP), moderación avanzada y persistencia robusta.
            </p>

            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '50px', textAlign: 'left' }}>
                <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3>✨ Sistema de Niveles</h3>
                    <p style={{ color: '#b9bbbe', fontSize: '14px' }}>Multiplica la actividad en tus canales con asignación dinámica de XP por mensaje.</p>
                </div>
                <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3>🔨 Moderación Firme</h3>
                    <p style={{ color: '#b9bbbe', fontSize: '14px' }}>Controla infracciones de forma eficiente manteniendo un historial limpio por servidor.</p>
                </div>
                <div style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                    <h3>🌐 Panel Web</h3>
                    <p style={{ color: '#b9bbbe', fontSize: '14px' }}>Configura el idioma, los prefijos y módulos del bot cómodamente desde esta plataforma.</p>
                </div>
            </div>

            {}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <a href={ENLACE_INVITACION_GLOBAL} target="_blank" rel="noreferrer" style={{ display: 'inline-block', backgroundColor: '#5865F2', color: 'white', padding: '16px 32px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
                    Invitar al Servidor
                </a>
                <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#43b581', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '5px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
                    Ir al Dashboard ➔
                </button>
            </div>
        </div>
    );
}