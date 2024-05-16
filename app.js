// Importaciones de módulos
import express from 'express';
import cors from 'cors';

// Importaciones de controladores
import auth_user from "./controllers/auth_user.js";
import todos from "./controllers/todos.js";

// Inicialización de la aplicación Express
const app = express();

// Configuración de middlewares estándar
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Ruta para 'Hello World!' 
app.get('/hello', (req, res) => {
    res.type('text/plain');  
    res.send('Hello World!');
});

// Configuración de rutas
app.use("/api", auth_user);
app.use("/api", todos);

// Exportación del módulo app
export default app;