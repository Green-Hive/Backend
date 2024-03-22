import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/authGoogle.controller.js";
import {login, logout, register} from "../controllers/authResolver.controller.js";

const routes = Router();

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);

routes.post('/register', register);
routes.post('/login', login);
routes.post('/logout', logout);
export default routes;