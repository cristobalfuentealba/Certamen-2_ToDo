import { users } from '../repositories/autentication.js';
import { object, string, boolean } from 'yup';

export function authMiddleware(req, res, next) {
    // Extraer token de autorización del encabezado
    const token = req.headers['x-authorization'];

    // Verificar si el token está presente
    if (!token) {
        return res.status(401).json({ error: 'No se ha enviado el token de autorización. Utiliza el encabezado X-Authorization.' });
    }

    // Buscar el usuario asociado al token
    const authenticatedUser = users.find(u => u.token === token);
    if (!authenticatedUser) {
        return res.status(401).json({ error: 'El token proporcionado es inválido.' });
    }

    // Añadir usuario al objeto de solicitud para su uso en rutas subsiguientes
    req.user = authenticatedUser;
    next();
}

const createTodoSchema = object({
    title: string().required()
});

const updateTodoSchema = object({
    title: string().optional(),
    completed: boolean().optional()
});


export function validateTodo (req, res, next) {
    const schema = req.method === 'POST' ? createTodoSchema : updateTodoSchema;
    
    schema.validate(req.body)
        .then(() => next())
        .catch(err => res.status(400).send({ error: err.message }));
}
