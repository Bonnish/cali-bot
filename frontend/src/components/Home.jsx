import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
    const ENLACE_INVITACION_GLOBAL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot`;

    return (
        <div className="container" style={{ marginTop: '100px', textAlign: 'center', paddingBottom: '60px' }}>
            <div className="animate-fade-in" style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '64px', marginBottom: '16px', letterSpacing: '-1px' }}>
                    Tu Servidor, <span className="text-gradient">Elevado.</span>
                </h1>
                <p style={{ fontSize: '22px', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
                    CaliBot es el bot siberiano de Discord diseñado para comunidades vibrantes. XP, moderación, y un panel web inigualable.
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '16px 36px', fontSize: '18px' }}>
                        Ir al Dashboard
                    </button>
                    <a href={ENLACE_INVITACION_GLOBAL} target="_blank" rel="noreferrer" className="btn btn-discord" style={{ padding: '16px 36px', fontSize: '18px' }}>
                        Invitar a CaliBot
                    </a>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', textAlign: 'left' }}>
                <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>✨</div>
                    <h3>Sistema de Niveles (XP)</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Premia la actividad en tus canales. Los usuarios ganan experiencia por interactuar, incentivando una comunidad más activa y saludable.
                    </p>
                </div>
                <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔨</div>
                    <h3>Moderación Implacable</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Mantén tu servidor seguro. Bans, Kicks, Warns y Mutes registrados permanentemente en una base de datos segura y auditable.
                    </p>
                </div>
                <div className="card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🌐</div>
                    <h3>Panel Web Premium</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        Configura todo el bot sin teclear comandos complejos. Interfaz intuitiva, limpia y protegida por autenticación JWT segura.
                    </p>
                </div>
            </div>
        </div>
    );
}