import dotenv from 'dotenv';
dotenv.config();

import {server} from './src/app.js';
import {appConfig} from "./src/config/config.js";
import {validateConfig} from './src/config/config.js';
import {testConnection} from './src/config/dbConfig.js';
import {initializeModels} from "./src/models/index.js";
import {initializeGames} from "./src/gameLogic/index.js";
import {sessionCreation} from "./src/gameLogic/sessionsManager.js";
import {getPlayerByName, registerNewPlayer} from "./src/services/playerService.js";

const startServer = async () => {
    try{
        //SERVER STARTUP ROUTINE
        console.log("======starting server=======");

        //validate configuration
        validateConfig();
        console.log('✅ Configuration validation passed');
        //test connection to database
        await testConnection();
        console.log('✅ Database checks ended successfully');
        //initialize models
        initializeModels();
        console.log('✅ Model initialization complete')
        //initialize games in DB
        await initializeGames();
        console.log('✅ Game initialization complete');

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
startServer().then(async () => {
    console.log('======startup routine terminated======');

    //====== TESTING SESSION ========
    await registerNewPlayer("lucaAdmin", "123456");
    const session = await sessionCreation(await getPlayerByName('lucaAdmin'), 1,);

    const newTestPlayer = await registerNewPlayer("newTestPlayer", "123456").then(
        status => status.newPlayer
    );
    setTimeout(() => {
        session.connectPlayer(newTestPlayer)
    }, 5000)

});