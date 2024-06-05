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
import {postAlert, getAllAlert, deleteAlert, deleteAllAlert} from '../controllers/alert.controller.js';

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

// ALERTS:
routes.post('/alert/', postAlert);
routes.get('/alert/all/:hiveId', getAllAlert);
routes.delete('/alert/:id', deleteAlert);
routes.delete('/alert/all/:hiveId', deleteAllAlert);

export default routes;
