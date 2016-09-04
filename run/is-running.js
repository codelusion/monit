'use strict';

module.exports = (params) => {
    var pgm = params.pgm;
    if (!pgm) {
        return {'error' : 'required param pgm= missing'};
    }
    return {
        cmd: 'ps -ef | grep ' + pgm + ' | grep -v "grep" | wc -l',
        args: [],
        options: {shell: true},
        format: (lines) => {
            return {'count': lines[0]};
        }
    };
};