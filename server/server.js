import dotenv from 'dotenv';
dotenv.config();

import {server} from './src/app.js';
import {appConfig} from "./src/config/config.js";
import {validateConfig} from './src/config/config.js';
import {testConnection} from './src/config/dbConfig.js';
import {initializeModels} from "./src/models/index.js";
import {initializeGames} from "#gameLogic/index.js";
import {sessionCreation} from "#gameLogic/sessionsManager.js";
import {registerNewPlayer} from "#services/playerService.js";

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
    const LucaAdmin = (await registerNewPlayer("lucaAdmin", "12345678")).newPlayer;
    const TestPlayer1 = (await registerNewPlayer("TestPlayer1", "12345678")).newPlayer;
    const TestPlayer2 = (await registerNewPlayer("TestPlayer2", "12345678")).newPlayer;
    const TestPlayer3 = (await registerNewPlayer("TestPlayer3", "12345678")).newPlayer;
    const TestPlayer4 = (await registerNewPlayer("TestPlayer4", "12345678")).newPlayer;


    const session1 = (await sessionCreation(LucaAdmin, 1, '', true)).result;
    const session2 = (await sessionCreation(TestPlayer1, 1)).result;
    const emptySession = (await sessionCreation(TestPlayer4, null, "emptySession")).result;

    setTimeout(() => {
        session1.connectPlayer(TestPlayer2)
    }, Math.random()*5000)

    setTimeout(() => {
        session2.connectPlayer(TestPlayer3)
    }, Math.random()*5000)

});