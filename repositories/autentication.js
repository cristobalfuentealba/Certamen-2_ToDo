import { scrypt, randomBytes } from 'node:crypto';

// Lista de usuarios con sus credenciales
export const users = [
    {
        username: 'admin',
        name: 'Gustavo Alfredo Marín Sáez',
        password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
    },
    {
        username: 'user',
        name: 'Gandalf',
        password: 'cc46a0a0a1320b7dd69fe26c288c9f32:bcd6c1505c8973be89c75d24184ecb9a2edb54913a18e955cfdd5a65eb63f933d2ad15acceebeccea494f4481522a074e1d60d0d58ab8ecad380988ee8ec7684'
    }
];

// Función para verificar la contraseña del usuario
export function checkPassword(password, hash) {
    const [salt, key] = hash.split(':');
    return new Promise((resolve) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                resolve(false);  // Manejar el error sin lanzar una excepción
            } else {
                resolve(derivedKey.toString('hex') === key);
            }
        });
    });
}

// Función para iniciar sesión del usuario
export async function login(username, password) {
    const user = users.find(user => user.username === username);
    if (!user) {
        throw new Error("Usuario y/o password incorrectos");
    }

    const passwordIsValid = await checkPassword(password, user.password);
    if (!passwordIsValid) {
        throw new Error("Usuario y/o password incorrectos");
    }

    user.token = randomBytes(48).toString('hex');  // Generar un nuevo token
    return {
        username: user.username,
        name: user.name,
        token: user.token
    };
}

// Función para cerrar sesión del usuario
export async function logout(req) {
    const authorizationToken = req.get('x-authorization');
    if (!authorizationToken) {
        return res.status(401).send({ error: 'Token de autorización no enviado. Recuerda usar el header X-Authorization' });
    }

    const user = users.find(user => user.token === authorizationToken);
    if (!user) {
        return res.status(401).send({ error: 'Token inválido' });
    }

    user.token = undefined;  // Eliminar el token asignado al usuario
}
