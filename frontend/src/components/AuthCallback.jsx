import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../services/api';

export default function AuthCallback({ onLoginSuccess }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const code = searchParams.get('code');

        if (code) {
            API.post('auth/discord/', { code })
                .then(res => {
                    
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    localStorage.setItem('guilds', JSON.stringify(res.data.guilds));
                    onLoginSuccess();
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 100);
                })
                .catch(err => {
                    console.error("Error en la autenticación:", err);
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [searchParams, navigate, onLoginSuccess]);

    return (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h2>Autenticando con Discord...</h2>
            <p>Por favor espera un momento.</p>
        </div>
    );
}