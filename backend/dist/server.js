"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const site_routes_1 = __importDefault(require("./routes/site.routes"));
const patrol_routes_1 = __importDefault(require("./routes/patrol.routes"));
const sao_routes_1 = __importDefault(require("./routes/sao.routes"));
const stats_routes_1 = __importDefault(require("./routes/stats.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/sites', site_routes_1.default);
app.use('/api/patrol', patrol_routes_1.default);
app.use('/api/sao', sao_routes_1.default);
app.use('/api/stats', stats_routes_1.default);
// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path_1.default.join(__dirname, '../../frontend/dist');
    app.use(express_1.default.static(frontendPath));
    // Handle React Router - serve index.html for all non-API routes
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    });
}
// Error handling
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map