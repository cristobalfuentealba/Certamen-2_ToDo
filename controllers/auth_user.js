import { Router } from "express";
import { login, logout } from '../repositories/autentication.js';
import { authMiddleware } from '../middlewares/middleware.js';
import { loginSchema } from '../schemas/index.js';
const router = Router();

router.post('/login', async (req, res) => {
    try {
        // Validar los datos de entrada
        let credentials = loginSchema.validateSync(req.body, { stripUnknown: true });
        // Intentar iniciar sesión con las credenciales validadas
        let user = await login(credentials.username, credentials.password);
        res.send(user);
    } catch (ex) {
        // Si hay un error de validación, devolver un 400 Bad Request
        if (ex.name === 'ValidationError') {
            return res.status(400).send({ error: "Datos de entrada incorrectos" });
        }
        // Para otros tipos de errores (como errores de autenticación), devolver un 401 Unauthorized
        return res.status(401).send({ error: "Credenciales inválidas o error de autenticación" });
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    try {
        await logout(req);
        return res.status(204).send();
    } catch (ex) {
        return res.status(404).send({ error: 'Error al procesar el cierre de sesión', details: ex });
    }
});

export default router;