import dotenv from 'dotenv';
dotenv.config();

import {server} from './src/app.js';
import {appConfig} from "./src/config/config.js";
import {validateConfig} from './src/config/config.js';
import {testConnection} from './src/config/dbConfig.js';
import {initializeModels} from "./src/models/index.js";

const startServer = async () => {
    try{
        validateConfig();
        console.log('✅ Configuration validation passed');
        //test connection to database
        await testConnection();
        console.log('✅ Database checks ended successfully');
        //initialize models
        initializeModels();
        console.log('✅ Model initialization complete')
        //check configuration

        //start server
        server.listen(appConfig.app.port, ()=>{
            console.log(`🚀 Server running on: ${appConfig.app.url}`);
            console.log('🎙️Server listening on port:', server.address().port);
            console.log(`📊 Environment: ${appConfig.app.env}`);
        })

        process.on('SIGTERM',()=>{
            console.log('SIGTERM received, shutting down gracefully');
            server.close(()=>{
                console.log('process terminated')
                process.exit(0);
            });
        });

        process.on('SIGINT',()=>{
            console.log('SIGINT received, shutting down gracefully');
            server.close(()=>{
                console.log('process terminated');
                process.exit(0);
            })
        });

    }catch(error){
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer().then(()=>{
    console.log('======startup routine terminated======');
});