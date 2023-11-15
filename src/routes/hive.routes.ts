import {Router} from 'express';
import {deleteHive, getAllHives, getHive, patchHive, postHive} from "../controllers/hive.controller";

const routes = Router();

routes.post('/', postHive);
routes.get('/', getAllHives);
routes.get('/:id', getHive);
routes.patch('/:id', patchHive);
routes.delete('/:id', deleteHive);

export default routes;