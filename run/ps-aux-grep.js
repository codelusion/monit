'use strict';

module.exports = (grepText) => {
    return {
        cmd: 'ps aux | head -n1; ps aux  | grep "' + grepText + '" | grep -v "grep"',
        args: [],
        options: {shell: true},
        format: (lines) => {
            var exclude = ['USER', 'TTY'];
            var result = [];
            var columnize = (str) => {
                return str.split(' ').map((h) => {
                    return h.trim()
                }).filter(Boolean);
            };
            var headers = columnize(lines[0]);
            var excludeCols = exclude.map((h) => {
                return headers.indexOf(h)
            });
            headers = headers.filter((col, idx) => {
                return excludeCols.indexOf(idx) == -1;
            });
            var rows = [];
            lines.slice(1).forEach((row) => {
                var cols = columnize(row).filter((col, idx) => {
                    return excludeCols.indexOf(idx) == -1;
                });
                var rObj = {};
                cols.forEach((col, idx) => {
                    var key = headers[idx];
                    if (idx >= headers.length) {
                        return;
                    }
                    rObj[key] = idx === headers.length - 1 ? cols.slice(idx).join(' ') : cols[idx];
                });
                result.push(rObj);
            });
            return result;
        }
    };
};