import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/authGoogle.controller";
import {login, logout, register} from "../controllers/authResolver.controller";

const routes = Router();

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);

routes.post('/register', register);
routes.post('/login', login);
routes.post('/logout', logout);
export default routes;