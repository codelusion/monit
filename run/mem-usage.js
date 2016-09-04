'use strict';

module.exports = {
    cmd: 'free',
    args: ['-h', '-m'],
    format: (lines) => {
        var data = lines.filter((line, idx) => {
            return idx >= 1;
        });
        var points = ['total', 'used', 'free', 'shared', 'buffers', 'cached'];
        var result = {
            'Memory': {},
            'Swap': {}
        };
        data[0]
            .replace('Mem:', '')
            .split(' ')
            .filter(Boolean)
            .map((col, idx) => result.Memory[points[idx]] = col.trim());
        data[2]
            .replace('Swap:', '')
            .split(' ')
            .filter(Boolean)
            .map((col, idx) => result.Swap[points[idx]] = col.trim());

        return result;
    }
};