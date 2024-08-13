"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.connectDB = exports.createServer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: process.env.CORS_FRONTEND,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));
        app.use('/', routes_1.default);
        return app;
    }
    catch (error) {
        console.error('An error occurred while creating the server:', error.message);
        throw error;
    }
};
exports.createServer = createServer;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURL = process.env.MONGODB_URL;
        yield mongoose_1.default.connect(mongoURL);
        console.log("Database connected");
    }
    catch (error) {
        console.error('An error occurred while connecting to MongoDB:', error.message);
        process.exit(1);
    }
});
exports.connectDB = connectDB;
const startServer = () => {
    try {
        (0, exports.connectDB)();
        const app = (0, exports.createServer)();
        app === null || app === void 0 ? void 0 : app.listen(3000, () => {
            console.log("Server is running @ 3000");
        });
    }
    catch (error) {
        console.error('An error occurred while starting the server:', error.message);
    }
};
exports.startServer = startServer;
(0, exports.startServer)();
