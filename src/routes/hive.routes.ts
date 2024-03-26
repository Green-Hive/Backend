import {Router} from 'express';
import {deleteHive, getAllHives, getHive, patchHive, postHive} from "../controllers/hive.controller.js";
import {postData, deleteData, deleteAllData} from "../controllers/hiveData.controller.js";

const routes = Router();

// HIVES:
routes.post('/', postHive);
routes.get('/', getAllHives);
routes.get('/:id', getHive);
routes.patch('/:id', patchHive);
routes.delete('/:id', deleteHive);

// DATA:
routes.post('/data/', postData);
routes.delete('/data/:id', deleteData);
routes.delete('/data/all/:hiveId', deleteAllData);

export default routes;