import {Router} from 'express';
import {getGoogleAuthInfo, requestGoogleAuthUrl} from "../controllers/auth.controller.ts";

const routes = Router();

routes.post('/google/', requestGoogleAuthUrl);
routes.get('/google/callback', getGoogleAuthInfo);
export default routes;