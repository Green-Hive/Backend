import {Router} from 'express';
import {deleteHive, getAllHives, getOneHive, patchHive, postHive} from "../controllers/hive.controller.js";
import {postData, getOneData, getAllData, deleteData, deleteAllData} from "../controllers/hiveData.controller.js";

const routes = Router();

// HIVES:
routes.post('/', postHive);
routes.get('/', getAllHives);
routes.get('/:id', getOneHive);
routes.patch('/:id', patchHive);
routes.delete('/:id', deleteHive);

// DATA:
routes.post('/data/', postData);
routes.get('/data/:id', getOneData);
routes.get('/data/all/:hiveId', getAllData);
routes.delete('/data/:id', deleteData);
routes.delete('/data/all/:hiveId', deleteAllData);

export default routes;