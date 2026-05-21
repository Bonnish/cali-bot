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
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', backgroundColor: '#18191c', borderBottom: '1px solid #2f3136', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, fontFamily: 'sans-serif' }}>
            {}
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '20px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                🛡️ CaliBot
            </div>

            {}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
                {user ? (
                    <div 
                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'white', padding: '5px 10px', borderRadius: '4px', backgroundColor: dropdownOpen ? '#2f3136' : 'transparent', transition: 'background-color 0.2s', userSelect: 'none' }}
                    >
                        {user.avatar ? (
                            <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5865F2' }} />
                        )}
                        <span style={{ fontWeight: '500', fontSize: '15px' }}>{user.username}</span>
                        <span style={{ fontSize: '12px' }}>▼</span>
                    </div>
                ) : (
                    <a href={DISCORD_LOGIN_URL} style={{ display: 'inline-block', backgroundColor: '#5865F2', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', transition: 'background 0.2s' }}>
                        Login
                    </a>
                )}

                {}
                {user && dropdownOpen && (
                    <div style={{ position: 'absolute', top: '45px', right: 0, backgroundColor: '#18191c', border: '1px solid #2f3136', borderRadius: '4px', width: '160px', boxShadow: '0px 8px 16px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                        <button 
                            onClick={() => { navigate('/dashboard'); setDropdownOpen(false); }} 
                            style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#b9bbbe', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = '#b9bbbe'}
                        >
                            🎛️ Dashboard
                        </button>
                        <button 
                            onClick={() => { navigate('/settings'); setDropdownOpen(false); }} 
                            style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#b9bbbe', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: '500' }}
                            onMouseEnter={(e) => e.target.style.color = 'white'}
                            onMouseLeave={(e) => e.target.style.color = '#b9bbbe'}
                        >
                            ⚙️ Settings
                        </button>
                        <div style={{ height: '1px', backgroundColor: '#2f3136' }} />
                        <button 
                            onClick={() => { handleLogout(); setDropdownOpen(false); }} 
                            style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#f04747', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f04747';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#f04747';
                            }}
                        >
                            🛑 Log Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}