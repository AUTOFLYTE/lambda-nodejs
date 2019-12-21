const sfxHelper = require('./signalfx-helper');

let sfxColdStart = true;

module.exports = (opts = {}) => {
    const config = opts;

    let startTime;

    return ({
        before: (handler, next) => {
            startTime = new Date().getTime();
            sfxHelper.setAccessToken(config.accessToken);
            sfxHelper.setLambdaFunctionContext(handler.context, this.dimensions);
            sfxHelper.sendCounter('function.invocations', 1);
            if (sfxColdStart) {
                sfxHelper.sendCounter('function.cold_starts', 1);
                sfxColdStart = false;
            }
            next();
        },
        after: (handler, next) => {
            sfxHelper.sendGauge('function.duration', new Date().getTime() - startTime);
            sfxHelper.waitForAllSends()
                .then(next());
        },
        onError: (handler) => {
            sfxHelper.sendCounter('function.errors', 1);
            sfxHelper.sendGauge('function.duration', new Date().getTime() - startTime);
            return new Promise((resolve) => {
                sfxHelper.waitForAllSends()
                    .then(() => {
                        resolve(handler.error);
                    });
            })
        }
    });
};
