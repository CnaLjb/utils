///<reference path='../DefinitelyTyped/app.d.ts' />
import EventEmitterMd = require('events');
import EventEmitter = EventEmitterMd.EventEmitter;
import util = require("util");
import express = require('express');
var app = express();

class MyQueue extends EventEmitter {

    private queue;

    private timer;

    constructor(){
        super();
        this.queue = [];
        var self = this;
        this.timer = new Timer(function() {
            // your function here
            if(self.queue.length > 0){
                console.log("\n触发定时器...\n");
                self.emit('msg',self.queue);
                self.queue = [];
            }
        },3000);
    }

    push(msg:any){
        this.queue.push(msg);
        var self = this;
        if(this.queue.length > 20){
            console.log("\n队列满了...\n");
            this.timer.reset();
            self.emit('msg',self.queue);
            self.queue = [];
        }
    }

        

}

function Timer(fn, t) {
    this.t = t;
    var timerObj = setInterval(fn, this.t);

    this.stop = function() {
        if (timerObj) {
            clearInterval(timerObj);
            timerObj = null;
        }
        return this;
    }

    // start timer using current settings (if it's not already running)
    this.start = function() {
        if (!timerObj) {
            this.stop();
            timerObj = setInterval(fn, t);
        }
        return this;
    }

    // start with new interval, stop current interval
    this.reset = function(newT) {
        if(newT){
            this.t = newT;
        }
        return this.stop().start();
    }
}


const myEmitter = new MyQueue();
myEmitter.on('msg', (data) => {
    var len = data.length;
    console.log("size:",len);
    for(var i=0;i<len;i++){
        console.log("%s\t:%s",i,data[i]);
    }
});

var total = 0;
app.get('/push', function (req:express.Request, res:express.Response) {
    var time = req.query.time;
    console.log("time:",time);
    for(var i=0;i<time;i++){
        myEmitter.push(util.format("我是 %d",total+i));
    }
})  
var server = app.listen(8081, function () {
  console.log("应用实例，访问地址为 http://%s:%s", "127.0.0.1",8081);

})
