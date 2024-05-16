import { setLocale } from "yup";
import { es } from "yup-locales";
import { object, string, bool } from "yup";

setLocale(es);

//validacion create
export const createTodoSchema = object({
  title: string().required().strict()
});
//validacion update
export const updateTodoSchema = object({
  title: string().optional().strict(),
  completed: bool().required().strict(),
  id: string().required().strict()
});
//validacion id
export const idTodoSchema = object({
  id: string().required().strict()
});
//validacion login
export const loginSchema = object({
  username: string().required().strict(),
  password: string().required().strict()
});



