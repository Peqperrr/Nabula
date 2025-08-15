/*
 * @author Maik
 * @version 1.0.0
 */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const logger = new common_1.Logger('Bootstrap');
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        // Configure middleware
        app.use((0, helmet_1.default)());
        app.use((0, compression_1.default)());
        app.enableCors({
            origin: configService.get('FRONTEND_URL', '*'),
            credentials: true
        });
        // API Configuration
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
            validationError: { target: false }
        }));
        // Configure Swagger
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Nabula Bot Dashboard API')
            .setDescription('API for managing the Nabula Discord Bot through a web dashboard')
            .setVersion('1.0.0')
            .addServer('/api/v1')
            .addTag('auth', 'Authentication endpoints')
            .addTag('servers', 'Server management endpoints')
            .addTag('modules', 'Feature module configuration endpoints')
            .addTag('users', 'User management endpoints')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true
            },
            customSiteTitle: 'Nabula API Documentation'
        });
        // Start server
        const port = configService.get('PORT', 3000);
        await app.listen(port);
        logger.log(`Application started on http://localhost:${port}`);
        logger.log(`API Documentation available at http://localhost:${port}/docs`);
        // Setup graceful shutdown
        const shutdown = async () => {
            logger.log('Shutting down application gracefully...');
            await app.close();
            process.exit(0);
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}
// Start the application
bootstrap().catch(error => {
    console.error('Failed to bootstrap application:', error);
    process.exit(1);
});