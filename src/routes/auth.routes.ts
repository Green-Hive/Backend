import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/authGoogle.controller.ts";
import {logout, register} from "../controllers/authResolver.controller.ts";

const routes = Router();

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);

routes.post('/register', register);
// routes.post('/login',);
routes.post('/logout', logout);
export default routes;