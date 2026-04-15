import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import DepartmentController from '../controllers/DepartmentController';
import RequestController, { upload } from '../controllers/RequestController';
import ConfigController, { uploadBrasao } from '../controllers/ConfigController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', AuthController.login);
router.post('/citizens', UserController.create); // Public registration
router.get('/config', ConfigController.show); // Public — needs no auth
router.get('/public/requests', RequestController.publicSearch); // Public search of responded requests

// Protected routes
router.use(authMiddleware);

router.get('/users', roleMiddleware(['ADMIN', 'CONTROL']), UserController.index);
router.post('/users', roleMiddleware(['ADMIN']), UserController.create);
router.put('/users/:id', roleMiddleware(['ADMIN']), UserController.update);
router.delete('/users/:id', roleMiddleware(['ADMIN']), UserController.destroy);

router.get('/departments', DepartmentController.index);
router.post('/departments', roleMiddleware(['ADMIN']), DepartmentController.store);
router.put('/departments/:id', roleMiddleware(['ADMIN']), DepartmentController.update);
router.delete('/departments/:id', roleMiddleware(['ADMIN']), DepartmentController.destroy);

router.put('/config', roleMiddleware(['ADMIN']), uploadBrasao.fields([{ name: 'coatOfArms', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), ConfigController.update);

router.get('/requests', RequestController.index);
router.post('/requests', RequestController.create);
router.get('/requests/:id', RequestController.show);
router.put('/requests/:id/respond', roleMiddleware(['ADMIN', 'TECHNICIAN', 'AUTHORITY']), RequestController.respond);
router.post('/requests/:id/assign', roleMiddleware(['ADMIN']), RequestController.assign);
router.post('/requests/:id/attachments', upload.array('files', 10), RequestController.uploadAttachment);
router.get('/requests/:id/attachments', RequestController.listAttachments);

export default router;
