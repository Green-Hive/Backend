import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/authGoogle.controller.js";
import {getLoggedUser, login, logout, register} from "../controllers/authResolver.controller.js";

const routes = Router();


routes.get('/me', getLoggedUser);
routes.post('/register', register);
routes.post('/login', login);
routes.post('/logout', logout);

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);
export default routes;
