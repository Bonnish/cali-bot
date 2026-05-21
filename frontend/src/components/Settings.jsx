import React, { useState } from 'react';

export default function Settings() {
    const [lang, setLang] = useState(localStorage.getItem('dashboard_lang') || 'en');

    const cambiarIdioma = (e) => {
        const nuevoIdioma = e.target.value;
        setLang(nuevoIdioma);
        localStorage.setItem('dashboard_lang', nuevoIdioma);
        window.location.reload();
    };

    return (
        <div style={{ maxWidth: '600px', margin: '80px auto', fontFamily: 'sans-serif', color: 'white' }}>
            <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚙️ Global Settings</h2>
            
            <div style={{ backgroundColor: '#1e1e24', padding: '24px', borderRadius: '8px', marginTop: '20px', border: '1px solid #333' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', color: '#b9bbbe' }}>
                    Dashboard Language
                </label>
                <select 
                    value={lang} 
                    onChange={cambiarIdioma} 
                    style={{ width: '100%', padding: '12px', backgroundColor: '#2f3136', color: 'white', border: '1px solid #444', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
                >
                    <option value="en">🇺🇸 English</option>
                    <option value="es">🇨🇱 Español</option>
                </select>
                <p style={{ color: '#72767d', fontSize: '13px', marginTop: '8px' }}>
                    This will change the display language for all menus, tables, and modules in your management panel.
                </p>
            </div>
        </div>
    );
}