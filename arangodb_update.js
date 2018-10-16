const Hapi = require('hapi');
const server = new Hapi.Server();
const apiHandlers = require("./dataUpdate/apiHandlers.js");
require('events').EventEmitter.prototype._maxListeners = 100;

server.connection({
   port: 8092,
   routes: {
       cors: true
   },
   compression: true
});

//外部调用接口触发全量数据更新
server.route({
    method: 'GET',
    path: '/updateGraphData',
    handler: apiHandlers.updateGraphData
});

//外部调用接口初始化增量更新的timestamp
server.route({
    method: 'GET',
    path: '/resetTimestamp',
    handler: apiHandlers.resetTimestamp
});

//外部调用接口删除lockResource
server.route({
    method: 'GET',
    path: '/deleteLockResource',
    handler: apiHandlers.deleteLockResource
});

//for test
server.route({
    method: 'GET',
    path: '/publishMessage',
    handler: apiHandlers.publishMessageToRedis
});

server.start((err) => {
    if (err) {
        console.error(err);
        logger.error(err);
        throw err;
    }
    console.log(`arangodb数据库数据更新API服务运行在:${server.info.uri}`);
});

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('NOT exit...');
    process.exit(1);
});

