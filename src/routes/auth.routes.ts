import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/authGoogle.controller.ts";

const routes = Router();

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);

// routes.post('/register',);
// routes.post('/login',);

routes.post('/logout',);
export default routes;