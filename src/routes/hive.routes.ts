import {Router} from 'express';
import {
  deleteHive,
  getAllHives,
  getOneHive,
  getUserAcessibleHives,
  getUserHive,
  giveUserAccessToHive,
  linkHiveToUser,
  patchHive,
  postHive,
  removeUserAccessToHive,
} from '../controllers/hive.controller.js';
import {postData, getOneData, getAllData, deleteData, deleteAllData} from '../controllers/hiveData.controller.js';

const routes = Router();

// HIVES:
routes.post('/', postHive);
routes.get('/', getAllHives);
routes.get('/userHive/:id', getUserHive);
routes.get('/:id', getOneHive);
routes.patch('/:id', patchHive);
routes.delete('/:id', deleteHive);
routes.post('/:hiveId/:userId', linkHiveToUser);
routes.get('/:userId/accessible', getUserAcessibleHives);
routes.patch('/:id/giveAccess', giveUserAccessToHive);
routes.patch('/:id/removeAccess', removeUserAccessToHive);

// DATA:
routes.post('/data/', postData);
routes.get('/data/:id', getOneData);
routes.get('/data/all/:hiveId', getAllData);
routes.delete('/data/:id', deleteData);
routes.delete('/data/all/:hiveId', deleteAllData);

export default routes;
