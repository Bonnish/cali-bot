import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import AuthCallback from './components/AuthCallback';
import ServerConfig from './components/ServerConfig';
import InfractionsLog from './components/InfractionsLog';
import Leaderboard from './components/Leaderboard';

function DiscordRedirect() {
    useEffect(() => {
        const CLIENT_ID = "1422365765683646556";
        const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/callback");
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;
    }, []);

    return (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h3>Redirecting to Discord authentication...</h3>
        </div>
    );
}

import DashboardShell from './components/DashboardShell';
import GuildMain from './components/GuildMain';
import UserProfileConfig from './components/UserProfileConfig';
import AutoMessages from './components/AutoMessages';

function App() {
    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem('user');
        return localUser ? JSON.parse(localUser) : null;
    });

    const [guilds, setGuilds] = useState(() => {
        const localGuilds = localStorage.getItem('guilds');
        return localGuilds ? JSON.parse(localGuilds) : [];
    });

    const [inicializando, setInicializando] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const cargarSesion = () => {
        const loggedUser = localStorage.getItem('user');
        const storedGuilds = localStorage.getItem('guilds');

        if (loggedUser && storedGuilds) {
            setUser(JSON.parse(loggedUser));
            setGuilds(JSON.parse(storedGuilds));
        }
        setInicializando(false);
    };

    useEffect(() => {
        cargarSesion();
    }, []);

    const handleLogout = () => {
        navigate('/', { replace: true });
        
        setTimeout(() => {
            localStorage.clear();
            setUser(null);
            setGuilds([]);
        }, 50);
    };

    if (inicializando) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#131316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
                <h3>Loading CaliBot...</h3>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#131316' }}>
            <Navbar user={user} handleLogout={handleLogout} isDashboard={location.pathname.startsWith('/dashboard')} />
            
            <div style={{ paddingTop: '60px' }}>
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    
                    <Route path="/dashboard" element={
                        user ? (
                            <DashboardShell user={user} guilds={guilds} handleLogout={handleLogout} />
                        ) : (
                            <Navigate to="/auth/redirect" />
                        )
                    }>
                        <Route path="profile" element={<UserProfileConfig user={user} />} />
                        <Route path=":guildId" element={<GuildMain user={user} />} />
                        <Route path=":guildId/config" element={<ServerConfig />} />
                        <Route path=":guildId/infractions" element={<InfractionsLog />} />
                        <Route path=":guildId/leaderboard" element={<Leaderboard />} />
                        <Route path=":guildId/auto-messages" element={<AutoMessages />} />
                    </Route>
                    
                    <Route path="/settings" element={
                        user ? (
                            <Settings />
                        ) : (
                            location.pathname === '/settings' ? <Navigate to="/auth/redirect" /> : <Navigate to="/" />
                        )
                    } />
                    
                    <Route path="/auth/redirect" element={<DiscordRedirect />} />
                    <Route path="/auth/callback" element={<AuthCallback onLoginSuccess={cargarSesion} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;