import { object, string, boolean } from 'yup';

// Esquema de validación para crear un nuevo ToDo
const createTodoSchema = object({
    title: string().required("El título es obligatorio")
});

// Esquema de validación para actualizar un ToDo existente
const updateTodoSchema = object({
    title: string().optional(),
    completed: boolean().optional()
});

// Middleware para validar datos de ToDo según el método HTTP
export function validateTodo (req, res, next) {
    let schema; 
    
    switch (req.method) {
        case 'POST':
            schema = createTodoSchema;
            break;
        case 'PUT':
            schema = updateTodoSchema; 
            break;
        default:
            return res.status(405).json({ error: "Método no permitido" });
    }

    
    schema.validate(req.body, { abortEarly: false })
        .then(() => next()) // Si pasa la validación, continúa con el siguiente middleware
        .catch(err => {
            const errors = err.inner.reduce((acc, current) => {
                acc[current.path] = current.message;
                return acc;
            }, {});
            res.status(400).json({ error: "Validación fallida", details: errors });
        });
}
