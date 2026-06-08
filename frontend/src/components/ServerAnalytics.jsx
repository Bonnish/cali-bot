import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import API from '../services/api';

export default function ServerAnalytics({ guildId }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [chartWidth, setChartWidth] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.clientWidth);
            }
        };
        
        // Esperamos un momento para que el DOM esté listo
        const timeoutId = setTimeout(updateWidth, 100);
        window.addEventListener('resize', updateWidth);
        
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', updateWidth);
        };
    }, [data]);

    useEffect(() => {
        API.get(`guilds/${guildId}/analytics/`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando analíticas:", err);
                setLoading(false);
            });
    }, [guildId]);

    if (loading) {
        return (
            <div className="card" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>Cargando analíticas...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return null;
    }

    // Custom Tooltip para darle estilo premium
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel" style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--accent-orange)' }}>
                    <p style={{ margin: '0 0 5px 0', color: 'var(--text-muted)', fontSize: '12px' }}>{label}</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: 'white' }}>
                        <span style={{ color: 'var(--accent-orange)' }}>{payload[0].value}</span> Mensajes
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card animate-fade-in" style={{ marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '24px', color: 'var(--accent-orange)' }}>📈</div>
                <div>
                    <h3 style={{ margin: 0 }}>Actividad de Mensajes</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>Últimos 7 días</p>
                </div>
            </div>
            
            <div ref={containerRef} style={{ width: '100%', height: 300 }}>
                {chartWidth > 0 && (
                    <AreaChart
                        width={chartWidth}
                        height={300}
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-orange)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--accent-orange)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis 
                            dataKey="display_date" 
                            stroke="var(--text-muted)" 
                            fontSize={12} 
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            stroke="var(--text-muted)" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            domain={[0, dataMax => (dataMax === 0 ? 10 : dataMax)]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="messages_count" 
                            stroke="var(--accent-orange)" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorMessages)" 
                        />
                    </AreaChart>
                )}
            </div>
        </div>
    );
}
