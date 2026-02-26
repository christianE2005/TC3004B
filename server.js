const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Clave secreta para firmar los JWT
const JWT_SECRET = 'tech-mihandra-secret-key-2026';

// Usuario y contraseña hardcodeados
const VALID_USER = 'chris';
const VALID_PASSWORD = 'sandia';

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ===================== RUTAS API =====================

// POST /api/login - Autenticación con JWT
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === VALID_USER && password === VALID_PASSWORD) {
        // Generar token JWT con expiración de 1 hora
        const token = jwt.sign(
            { username: VALID_USER },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: VALID_USER
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
    });
});

// GET /api/verify - Verificar si el token JWT es válido
app.get('/api/verify', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ valid: true, user: decoded.username });
    } catch (err) {
        return res.status(401).json({ valid: false, message: 'Token inválido o expirado' });
    }
});

// ===================== INICIAR SERVIDOR =====================
app.listen(PORT, () => {
    console.log(`\n  ✅ Servidor Tech Mihandra corriendo en:`);
    console.log(`  👉 http://localhost:${PORT}`);
    console.log(`  👉 http://localhost:${PORT}/login.html`);
    console.log(`\n  Usuario: ${VALID_USER}`);
    console.log(`  Contraseña: ${VALID_PASSWORD}\n`);
});
