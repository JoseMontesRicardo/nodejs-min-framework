import Sequelize from 'sequelize';
import fs from 'fs';
import appRootDir from 'app-root-dir';
// import Connection from './src/repositories/Connection';
import Express from 'express';
import {RouterHelper, EnviromentHelper, ConnectionsHelper, BaseHelper} from './core/@helpers';
import http from 'http';
import cors from 'cors'; 

(async () => {
    try {
        //init utils
        let routerHelper = new RouterHelper();

        let baseHelper = new BaseHelper();

        baseHelper.loadBaseFiles();

        // read enviroment
        let enviroment = await EnviromentHelper.readEnviroment();

        // define port from config file
        let port = enviroment.port;
        
        //start connections and sequelize
        let connection = new ConnectionsHelper();
        global.sequelize = await connection.getConnection();
        
        //start Express
        let app = Express();
        let router = Express.Router();
        await routerHelper.startRoutes(app, router);
         
        //Expressjs configurations
        // enable cors
        app.use(cors());
        // await util.startRoutes(app, router);

        //create server http
        app.server = http.createServer(app);
        app.server.listen(port, () => {
            console.log(`Running on ${port}`);
        })

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
})()
