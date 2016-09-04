'use strict';

module.exports = {
    cmd: 'top -b -n1 -mM | head -n6',
        args: [],
        options: {shell: true},
    format: (lines) => {
        var result = {};
        var data = lines[0].split(',');
        result['Uptime'] = data[0].split('up')[1].trim() + ' ' + data[1].trim() + " mins";
        result['Users'] = data[2].replace(/[a-zA-Z].*/, '').trim();
        result['Load Average'] = data.slice(3).join(', ').replace(/[^0-9,]*/, '').trim();
        result['Tasks'] = lines[1].replace('Tasks:', '').trim();
        lines.slice(1).forEach(function(line){
            data = line.split(':');
            result[data[0]] = data.slice(1).join('');
        });
        [
            {old: '%us', new: '% user'},
            {old: '%sy', new: '% system'},
            {old: '%ni', new: '% nice'},
            {old: '%id', new: '% idle'},
            {old: '%wa', new: '% waiting'},
        ].forEach((r) => {  result['Cpu(s)'] = result['Cpu(s)'].replace(r.old, r.new); });
        return result;
    }
};
