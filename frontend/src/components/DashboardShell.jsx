import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, useLocation } from 'react-router-dom';
import API from '../services/api';

export default function DashboardShell({ user, guilds, handleLogout }) {
    const navigate = useNavigate();
    const { guildId } = useParams();
    const location = useLocation();

    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "1422365765683646556";
    const generarEnlaceInvitacion = (gId) => {
        return `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot&guild_id=${gId}&disable_guild_select=true`;
    };

    if (!user) {
        return (
            <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h1 className="text-gradient">Panel de Control</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Inicia sesión para gestionar los servidores de tu bot</p>
                <a href={`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent("http://localhost:5173/auth/callback")}&scope=identify+guilds`} className="btn btn-discord" style={{ padding: '14px 28px', fontSize: '18px' }}>
                    Iniciar Sesión con Discord
                </a>
            </div>
        );
    }

    const activeGuild = guilds.find(g => g.id === guildId);

    const [guildConfig, setGuildConfig] = useState(null);

    // Fetch config silently to know module status
    useEffect(() => {
        if (guildId && activeGuild) {
            API.get(`guilds/${guildId}/config/`)
                .then(res => setGuildConfig(res.data))
                .catch(err => console.error(err));
        }
    }, [guildId, activeGuild]);

    const getModuleStatus = (optId) => {
        if (!guildConfig && optId === 'leaderboard') return 'loading';
        if (optId === 'leaderboard') return guildConfig.xp_enabled ? 'enabled' : 'disabled';
        if (['auto-messages', 'social-alerts', 'tickets', 'autoroles'].includes(optId)) return 'disabled';
        return null;
    };

    const menuCategories = [
        {
            title: "General",
            items: [
                { id: 'main', label: 'Vista General', icon: '🏠', path: `/dashboard/${guildId}` },
                { id: 'config', label: 'Configuración Base', icon: '⚙️', path: `/dashboard/${guildId}/config` },
            ]
        },
        {
            title: "Ajuste de Módulos",
            items: [
                { id: 'leaderboard', label: 'Sistema de XP', icon: '🏆', path: `/dashboard/${guildId}/leaderboard` }
            ]
        },
        {
            title: "Notificaciones",
            items: [
                { id: 'auto-messages', label: 'Mensajes Automáticos', icon: '💬', path: `/dashboard/${guildId}/auto-messages` },
                { id: 'social-alerts', label: 'Twitch / YouTube', icon: '🔴', path: '#', disabled: true },
            ]
        },
        {
            title: "Moderación y Utilidad",
            items: [
                { id: 'infractions', label: 'Historial de Mod', icon: '📜', path: `/dashboard/${guildId}/infractions` },
                { id: 'tickets', label: 'Sistema de Tickets', icon: '🎟️', path: '#', disabled: true },
                { id: 'autoroles', label: 'Auto-roles', icon: '🎭', path: '#', disabled: true },
            ]
        }
    ];

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
            {/* Global Sidebar (Leftmost) */}
            <div style={{ width: '80px', backgroundColor: '#0f0f11', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15px', gap: '15px', overflowY: 'auto' }}>
                
                {/* User Profile Config Button */}
                <div 
                    onClick={() => navigate('/dashboard/profile')}
                    style={{
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        transform: location.pathname === '/dashboard/profile' ? 'scale(1.1)' : 'scale(1)',
                    }}
                    title="Configuración Global del Perfil"
                >
                    {location.pathname === '/dashboard/profile' && (
                        <div style={{ position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '30px', backgroundColor: 'var(--accent-orange)', borderRadius: '0 4px 4px 0' }} />
                    )}
                    {user.avatar ? (
                        <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Perfil" style={{ width: '50px', height: '50px', borderRadius: location.pathname === '/dashboard/profile' ? '16px' : '50%', border: location.pathname === '/dashboard/profile' ? '2px solid var(--accent-orange)' : '2px solid transparent', transition: 'all 0.2s' }} />
                    ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: location.pathname === '/dashboard/profile' ? '16px' : '50%', backgroundColor: 'var(--discord)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', border: location.pathname === '/dashboard/profile' ? '2px solid var(--accent-orange)' : '2px solid transparent', transition: 'all 0.2s' }}>
                            {user.username.charAt(0)}
                        </div>
                    )}
                </div>

                <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--border-color)', borderRadius: '2px', margin: '5px 0' }} />
                {guilds.map((guild) => {
                    const isActive = guild.id === guildId;
                    return (
                        <div 
                            key={guild.id}
                            onClick={() => {
                                if (guild.has_bot) {
                                    navigate(`/dashboard/${guild.id}`);
                                } else {
                                    window.open(generarEnlaceInvitacion(guild.id), '_blank');
                                }
                            }}
                            style={{
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                filter: guild.has_bot ? 'none' : 'grayscale(100%)',
                                opacity: guild.has_bot ? 1 : 0.6,
                                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                            }}
                            title={guild.name}
                        >
                            {/* Active indicator line */}
                            {isActive && (
                                <div style={{ position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '4px', height: '30px', backgroundColor: 'var(--accent-orange)', borderRadius: '0 4px 4px 0' }} />
                            )}
                            
                            {guild.icon ? (
                                <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} alt={guild.name} style={{ width: '50px', height: '50px', borderRadius: isActive ? '16px' : '50%', border: isActive ? '2px solid var(--accent-orange)' : '2px solid transparent', transition: 'all 0.2s' }} />
                            ) : (
                                <div style={{ width: '50px', height: '50px', borderRadius: isActive ? '16px' : '50%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', border: isActive ? '2px solid var(--accent-orange)' : '2px solid transparent', transition: 'all 0.2s' }}>
                                    {guild.name.charAt(0)}
                                </div>
                            )}
                            
                            {!guild.has_bot && (
                                <div style={{ position: 'absolute', bottom: -5, right: -5, backgroundColor: '#222', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                                    ➕
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Inner Sidebar & Main Content Wrapper */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Inner Sidebar (Guild Navigation) */}
            {guildId && activeGuild && (
                <div style={{ width: '250px', backgroundColor: '#131316', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
                    <div style={{ padding: '0 20px', marginBottom: '20px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeGuild.name}</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 10px 20px 10px', overflowY: 'auto' }}>
                        {menuCategories.map((category, idx) => (
                            <div key={idx}>
                                <div style={{ padding: '0 15px', marginBottom: '8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                                    {category.title}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    {category.items.map(opt => {
                                        const isCurrentPath = location.pathname === opt.path || (opt.id === 'main' && location.pathname === `/dashboard/${guildId}`);
                                        return (
                                            <div 
                                                key={opt.id}
                                                onClick={() => !opt.disabled && navigate(opt.path)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', borderRadius: '8px', cursor: opt.disabled ? 'not-allowed' : 'pointer',
                                                    backgroundColor: isCurrentPath ? 'var(--bg-card-hover)' : 'transparent',
                                                    color: isCurrentPath ? 'var(--accent-orange)' : (opt.disabled ? 'var(--text-muted)' : 'var(--text-main)'),
                                                    opacity: opt.disabled ? 0.5 : 1,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => {
                                                    if(!opt.disabled && !isCurrentPath) {
                                                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if(!opt.disabled && !isCurrentPath) {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                    <span style={{ fontSize: '18px' }}>{opt.icon}</span>
                                                    <span style={{ fontWeight: isCurrentPath ? '600' : '400', fontSize: '14px' }}>{opt.label}</span>
                                                </div>
                                                {getModuleStatus(opt.id) && (
                                                    <div style={{ 
                                                        width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
                                                        backgroundColor: getModuleStatus(opt.id) === 'enabled' ? '#00ff00' : (getModuleStatus(opt.id) === 'disabled' ? '#000000' : 'transparent'),
                                                        boxShadow: getModuleStatus(opt.id) === 'enabled' ? '0 0 8px #00ff00' : '0 0 5px rgba(0,0,0,0.8)'
                                                    }} title={getModuleStatus(opt.id) === 'enabled' ? 'Módulo Activado' : 'Módulo Desactivado'} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div style={{ flex: 1, backgroundColor: 'var(--bg-dark)', overflowY: 'auto' }}>
                {location.pathname === '/dashboard/profile' ? (
                    <Outlet />
                ) : guildId && activeGuild ? (
                    <Outlet />
                ) : (
                    !guildId && (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '60px', marginBottom: '20px' }}>👈</div>
                            <h2>Selecciona un servidor</h2>
                            <p>O añade a CaliBot a uno nuevo haciendo clic en el icono ➕</p>
                        </div>
                    )
                )}
            </div>
            </div>
        </div>
    );
}
