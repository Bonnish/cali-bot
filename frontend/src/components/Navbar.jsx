import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, handleLogout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
    const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/callback");
    const DISCORD_LOGIN_URL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="glass-panel" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '12px 40px', 
            position: 'fixed', 
            top: 0, left: 0, right: 0, 
            zIndex: 100,
            borderBottom: '1px solid var(--border-color)',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderRadius: 0
        }}>
            <div 
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} 
                onClick={() => navigate('/')}
            >
                <h2 style={{ margin: 0, fontSize: '24px' }}>
                    <span className="text-gradient">Cali</span>Bot
                </h2>
            </div>

            <div style={{ position: 'relative' }} ref={dropdownRef}>
                {user ? (
                    <div 
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        style={{ 
                            display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', 
                            padding: '6px 12px', borderRadius: '8px', 
                            backgroundColor: dropdownOpen ? 'rgba(255,255,255,0.05)' : 'transparent', 
                            transition: 'background-color 0.2s', userSelect: 'none' 
                        }}
                    >
                        {user.avatar ? (
                            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-orange)' }} />
                        ) : (
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--discord)' }} />
                        )}
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{user.username}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>▼</span>
                    </div>
                ) : (
                    <a href={DISCORD_LOGIN_URL} className="btn btn-primary">
                        Iniciar Sesión
                    </a>
                )}

                {user && dropdownOpen && (
                    <div className="card animate-fade-in" style={{ 
                        position: 'absolute', top: '55px', right: 0, 
                        width: '200px', padding: '8px',
                        display: 'flex', flexDirection: 'column', gap: '4px',
                        boxShadow: '0px 10px 30px rgba(0,0,0,0.8)'
                    }}>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }} 
                            style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                        >
                            🎛️ Dashboard
                        </button>
                        <button 
                            className="btn btn-secondary"
                            onClick={() => { navigate('/settings'); setDropdownOpen(false); }} 
                            style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                        >
                            ⚙️ Ajustes
                        </button>
                        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '4px 0' }} />
                        <button 
                            className="btn btn-danger"
                            onClick={() => { handleLogout(); setDropdownOpen(false); }} 
                            style={{ justifyContent: 'flex-start', border: 'none' }}
                        >
                            🛑 Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}