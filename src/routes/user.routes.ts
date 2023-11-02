import {Router} from 'express';
import {deleteUser, getAllUsers, getUser, patchUser, postUser} from '../controllers/user.controller';

const routes = Router();

routes.post('/z', postUser);
routes.get('/', getAllUsers);
routes.get('/:id', getUser);
routes.patch('/:id', patchUser);
routes.delete('/:id', deleteUser);

export default routes;