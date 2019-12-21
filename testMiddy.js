'use strict';

const signalFxLambda = require('./signalfx-lambda');
const middy = require('middy');

exports.handler = middy((event, context, callback) => {
    console.log('Inside the function.');
    const performance = Math.random();
    signalFxLambda.helper.sendGauge('application.performance', performance, {'abc': 'def'});
    console.log('Custom app metric is ' + performance);
    setTimeout(function () {
        callback(null, 'this is the result returned');
    }, 1000);
}).use(signalFxLambda.middleware());
