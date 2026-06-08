import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function InfractionsLog() {
    const { guildId } = useParams();
    const navigate = useNavigate();
    
    const [infractions, setInfractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        API.get(`guilds/${guildId}/infractions/`)
            .then(res => {
                setInfractions(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudo cargar el historial de infracciones.');
                setLoading(false);
            });
    }, [guildId]);

    const getTypeClass = (type) => {
        switch (type.toLowerCase()) {
            case 'ban': return 'badge badge-ban';
            case 'kick': return 'badge badge-kick';
            case 'warn': return 'badge badge-warn';
            case 'mute': return 'badge badge-mute';
            default: return 'badge';
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '1000px', marginTop: '40px', paddingBottom: '60px' }}>
            <button onClick={() => navigate(`/dashboard/${guildId}`)} className="btn btn-secondary" style={{ marginBottom: '30px' }}>
                ← Volver a Configuración
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <div style={{ fontSize: '32px', padding: '12px', backgroundColor: 'rgba(255, 71, 87, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
                    🛡️
                </div>
                <div>
                    <h2 style={{ margin: 0 }}>Historial de Infracciones</h2>
                    <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Registro inmutable de moderación del servidor.</p>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--danger)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                    <h3 style={{ color: 'var(--text-muted)' }}>Consultando base de datos...</h3>
                </div>
            ) : error ? (
                <div className="card" style={{ textAlign: 'center', borderColor: 'var(--danger)' }}>
                    <h3 style={{ color: 'var(--danger)' }}>{error}</h3>
                </div>
            ) : infractions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderStyle: 'dashed' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.8 }}>🕊️</div>
                    <h3 style={{ marginBottom: '10px' }}>Historial Limpio</h3>
                    <p style={{ color: 'var(--text-muted)' }}>¡Nadie ha sido sancionado aún! Este servidor es un ejemplo a seguir.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Acción</th>
                                <th>Usuario Sancionado</th>
                                <th>Moderador</th>
                                <th>Motivo</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {infractions.map((inf) => {
                                const date = new Date(inf.created_at);
                                return (
                                    <tr key={inf.id}>
                                        <td>
                                            <span className={getTypeClass(inf.action_type)}>
                                                {inf.action_type}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--text-main)' }}>{inf.user_id}</td>
                                        <td style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--discord)' }}>{inf.moderator_id}</td>
                                        <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={inf.reason}>
                                            {inf.reason || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sin motivo especificado</span>}
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                            {date.toLocaleDateString()} <span style={{ opacity: 0.6 }}>{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
