import {Router} from 'express';
import {deleteHive, getAllHives, getHive, patchHive, postHive} from "../controllers/hive.controller.js";
import {postData} from "../controllers/hiveData.controller.js";

const routes = Router();

// HIVES:
routes.post('/', postHive);
routes.get('/', getAllHives);
routes.get('/:id', getHive);
routes.patch('/:id', patchHive);
routes.delete('/:id', deleteHive);

// DATA:
routes.post('/data/', postData);

export default routes;