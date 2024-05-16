import { Router } from "express";
import { todos, insert, updateTodoById, deleteTodoById } from "../repositories/todos.js";
import { authMiddleware } from "../middlewares/middleware.js";
import { validateTodo } from "../middlewares/validationMiddleware.js"; 
const router = Router();

// Función auxiliar para manejar y enviar respuestas de error HTTP más fácilmente
function sendHttpError(res, statusCode, message) {
    res.status(statusCode).send({ error: message });
}

// Endpoint para listar todos los TODOs. Utiliza middleware de autenticación.
router.get('/todos', authMiddleware, (req, res) => res.send(todos));

// Endpoint para buscar un TODO específico por ID. Utiliza middleware de autenticación.
router.get('/todos/:id', authMiddleware, (req, res) => {
    const todo = todos.find(t => t.id === req.params.id);
    todo ? res.send(todo) : sendHttpError(res, 404, 'Item no encontrado');
});

// Endpoint para crear un nuevo TODO. Valida la entrada usando un esquema y utiliza middleware de autenticación.
router.post('/todos', authMiddleware, validateTodo, (req, res) => {
    try {
        const newTodo = insert(req.body.title);
        res.status(201).send(newTodo);
    } catch (error) {
        // Asegúrate de capturar y responder correctamente a los errores de validación
        res.status(400).send({ error: 'Datos incorrectos', details: error.message });
    }
});


// Endpoint para actualizar un TODO existente. Comprueba la validez de los datos y utiliza middleware de autenticación.
router.put('/todos/:id', authMiddleware, validateTodo, (req, res) => {
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
        return res.status(404).send({ error: 'Item no encontrado' });
    }

    try {
        const updatedTodo = updateTodoById(req.params.id, req.body);
        res.send(updatedTodo);
    } catch (error) {
        res.status(400).send({ error: 'Error al actualizar el ToDo', details: error.message });
    }
});


// Endpoint para eliminar un TODO específico por ID. Utiliza middleware de autenticación.
router.delete('/todos/:id', authMiddleware, (req, res) => {
    const success = deleteTodoById(req.params.id);
    if (!success) {
        return sendHttpError(res, 404, 'Item no encontrado');
    }
    res.status(204).send();  // Envía una respuesta sin contenido, indicando éxito
});

// Exportar el router para ser utilizado en otras partes de la aplicación
export default router;
