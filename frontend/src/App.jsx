import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // <-- Asegúrate de importar useNavigate aquí arriba
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';

function DiscordRedirect() {
    useEffect(() => {
        const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
        const REDIRECT_URI = encodeURIComponent("http://localhost:5173/auth/callback");
        window.location.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=identify+guilds`;
    }, []);

    return (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h3>Redirigiendo a la autenticación de Discord...</h3>
            <p>Por favor espera un momento.</p>
        </div>
    );
}

function App() {
    const [user, setUser] = useState(null);
    const [guilds, setGuilds] = useState([]);
    const [inicializando, setInicializando] = useState(true);
    const navigate = useNavigate();

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
        navigate('/');
        localStorage.clear();
        setUser(null);
        setGuilds([]);
    };

    if (inicializando) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#131316', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
                <h3>Cargando CaliBot...</h3>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#131316', padding: '20px' }}>
            <Routes>
                {}
                <Route path="/" element={<Home />} />
                
                {}
                <Route path="/dashboard" element={
                    user ? (
                        <Dashboard user={user} guilds={guilds} handleLogout={handleLogout} />
                    ) : (
                        <Navigate to="/auth/redirect" />
                    )
                } />
                
                {}
                <Route path="/auth/redirect" element={<DiscordRedirect />} />

                {}
                <Route path="/auth/callback" element={<AuthCallback onLoginSuccess={cargarSesion} />} />
            </Routes>
        </div>
    );
}

export default App;