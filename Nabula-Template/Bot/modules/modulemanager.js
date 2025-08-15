/*
 * @file Manages the loading and initialization of all bot modules.
 * @author Maik
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { LoggerUtils } = require('../api/logger.utils.js');

const logger = new LoggerUtils('ModuleManager');

class ModuleManager {
    constructor(client) {
        this.client = client;
        this.modules = new Map();
    }

    /**
     * Loads all modules from the modules directory.
     */
    async loadModules() {
        const modulesPath = path.join(__dirname); // Assumes this file is in the 'modules' directory
        const moduleFiles = fs.readdirSync(modulesPath).filter(file => file.endsWith('.js') && file !== 'ModuleManager.js');

        logger.info(`Found ${moduleFiles.length} modules to load...`);

        for (const file of moduleFiles) {
            try {
                const modulePath = path.join(modulesPath, file);
                const ModuleClass = require(modulePath);

                // Check if it's a valid module class
                if (typeof ModuleClass === 'function' && ModuleClass.prototype.init) {
                    const moduleInstance = new ModuleClass(this.client);
                    const moduleName = ModuleClass.name;
                    
                    await moduleInstance.init();
                    this.modules.set(moduleName, moduleInstance);
                    logger.info(`Successfully loaded and initialized module: ${moduleName}`);
                } else {
                    logger.warn(`File ${file} does not export a valid module class. Skipping.`);
                }
            } catch (error) {
                logger.error(`Failed to load module from file ${file}:`, error);
            }
        }
    }
}

module.exports = { ModuleManager };
