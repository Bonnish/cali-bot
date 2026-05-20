import React from 'react';

export default function Dashboard({ user, guilds, handleLogout }) {
    
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
    const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/callback");
    const DISCORD_LOGIN_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;

    const generarEnlaceInvitacion = (guildId) => {
        return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot&guild_id=${guildId}&disable_guild_select=true`;
    };

    if (!user) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif', color: 'white' }}>
                <h1>🛡️ CaliBot Web Panel</h1>
                <p>Inicia sesión para gestionar los servidores de tu bot</p>
                <a href={DISCORD_LOGIN_URL} style={{ display: 'inline-block', backgroundColor: '#5865F2', color: 'white', padding: '12px 24px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '20px' }}>
                    Iniciar Sesión con Discord
                </a>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', color: 'white' }}>
            {/* Header Perfil */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {user.avatar ? (
                        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ width: '50px', borderRadius: '50%' }} />
                    ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#5865F2' }} />
                    )}
                    <h3>Bienvenido, {user.username} 👋</h3>
                </div>
                <button onClick={handleLogout} style={{ backgroundColor: '#f04747', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cerrar Sesión
                </button>
            </div>

            <h2>Selecciona un servidor para configurar:</h2>
            
            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {guilds.map(guild => (
                    <div key={guild.id} style={{ backgroundColor: '#1e1e24', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', opacity: guild.has_bot ? 1 : 0.75 }}>
                        <div>
                            {guild.icon ? (
                                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }} />
                            ) : (
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#2f3136', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '20px', fontWeight: 'bold' }}>
                                    {guild.name.charAt(0)}
                                </div>
                            )}
                            <h4 style={{ margin: '10px 0 15px', maxWidth: '160px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {guild.name}
                            </h4>
                        </div>

                        {guild.has_bot ? (
                            <button style={{ backgroundColor: '#43b581', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
                                Configurar
                            </button>
                        ) : (
                            <a href={generarEnlaceInvitacion(guild.id)} target="_blank" rel="noreferrer" style={{ display: 'block', backgroundColor: '#5865F2', color: 'white', textDecoration: 'none', padding: '8px 12px', borderRadius: '4px', width: '90%', fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>
                                Añadir Bot
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}