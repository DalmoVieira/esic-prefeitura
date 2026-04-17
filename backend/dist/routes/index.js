"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
const DepartmentController_1 = __importDefault(require("../controllers/DepartmentController"));
const RequestController_1 = __importStar(require("../controllers/RequestController"));
const ConfigController_1 = __importStar(require("../controllers/ConfigController"));
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/login', AuthController_1.default.login);
router.post('/citizens', UserController_1.default.create); // Public registration
router.get('/config', ConfigController_1.default.show); // Public — needs no auth
router.get('/public/requests', RequestController_1.default.publicSearch); // Public search of responded requests
// Protected routes
router.use(auth_1.authMiddleware);
router.get('/users', (0, auth_1.roleMiddleware)(['ADMIN', 'CONTROL']), UserController_1.default.index);
router.post('/users', (0, auth_1.roleMiddleware)(['ADMIN']), UserController_1.default.create);
router.put('/users/:id', (0, auth_1.roleMiddleware)(['ADMIN']), UserController_1.default.update);
router.delete('/users/:id', (0, auth_1.roleMiddleware)(['ADMIN']), UserController_1.default.destroy);
router.get('/departments', DepartmentController_1.default.index);
router.post('/departments', (0, auth_1.roleMiddleware)(['ADMIN']), DepartmentController_1.default.store);
router.put('/departments/:id', (0, auth_1.roleMiddleware)(['ADMIN']), DepartmentController_1.default.update);
router.delete('/departments/:id', (0, auth_1.roleMiddleware)(['ADMIN']), DepartmentController_1.default.destroy);
router.put('/config', (0, auth_1.roleMiddleware)(['ADMIN']), ConfigController_1.uploadBrasao.fields([{ name: 'coatOfArms', maxCount: 1 }, { name: 'favicon', maxCount: 1 }]), ConfigController_1.default.update);
router.get('/requests', RequestController_1.default.index);
router.post('/requests', RequestController_1.default.create);
router.get('/requests/:id', RequestController_1.default.show);
router.put('/requests/:id/respond', (0, auth_1.roleMiddleware)(['ADMIN', 'TECHNICIAN', 'AUTHORITY']), RequestController_1.default.respond);
router.post('/requests/:id/assign', (0, auth_1.roleMiddleware)(['ADMIN']), RequestController_1.default.assign);
router.post('/requests/:id/attachments', RequestController_1.upload.array('files', 10), RequestController_1.default.uploadAttachment);
router.get('/requests/:id/attachments', RequestController_1.default.listAttachments);
exports.default = router;
//# sourceMappingURL=index.js.map