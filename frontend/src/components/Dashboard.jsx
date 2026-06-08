import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ user, guilds, handleLogout }) {
    const navigate = useNavigate();

    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
    const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/callback");
    const DISCORD_LOGIN_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;

    const generarEnlaceInvitacion = (guildId) => {
        return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}&disable_guild_select=true`;
    };

    if (!user) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 className="text-gradient">Panel de Control</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Inicia sesión para gestionar los servidores de tu bot</p>
                <a href={DISCORD_LOGIN_URL} className="btn btn-discord" style={{ padding: '14px 28px', fontSize: '18px' }}>
                    Iniciar Sesión con Discord
                </a>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '40px', paddingBottom: '60px' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', padding: '20px 30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {user.avatar ? (
                        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ width: '60px', borderRadius: '50%', border: '2px solid var(--accent-orange)' }} />
                    ) : (
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--discord)' }} />
                    )}
                    <div>
                        <h2 style={{ margin: 0 }}>¡Hola, {user.username}! 👋</h2>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Selecciona un servidor para configurar</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {guilds.map((guild, idx) => (
                    <div key={guild.id} className="card" style={{ 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', 
                        opacity: guild.has_bot ? 1 : 0.6,
                        animationDelay: `${idx * 0.05}s`
                    }}>
                        <div style={{ position: 'relative', marginBottom: '15px' }}>
                            {guild.icon ? (
                                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} style={{ width: '80px', height: '80px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} />
                            ) : (
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' }}>
                                    {guild.name.charAt(0)}
                                </div>
                            )}
                            {guild.has_bot && (
                                <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--success)', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid var(--bg-card)' }} title="Bot activo" />
                            )}
                        </div>

                        <h3 style={{ margin: '0 0 20px', textAlign: 'center', maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {guild.name}
                        </h3>

                        <div style={{ width: '100%', marginTop: 'auto' }}>
                            {guild.has_bot ? (
                                <button
                                    onClick={() => navigate(`/dashboard/${guild.id}`)}
                                    className="btn btn-primary" style={{ width: '100%' }}>
                                    Configurar
                                </button>
                            ) : (
                                <a href={generarEnlaceInvitacion(guild.id)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', textAlign: 'center' }}>
                                    Añadir Bot
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}