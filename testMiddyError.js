'use strict';

const signalFxLambda = require('./signalfx-lambda');
const middy = require('middy');

exports.handler = middy((event, context, callback) => {
    console.log('Inside the function.');
    const performance = Math.random();
    signalFxLambda.helper.sendGauge('application.performance', performance, {'abc': 'def'});
    console.log('Custom app metric is ' + performance);
    throw(new Error('There is a false error...'));
}).use(signalFxLambda.middleware());
