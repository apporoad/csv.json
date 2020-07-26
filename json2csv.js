#!/usr/bin/env node

var program = require('commander');
var path = require('path')
const p = require('lisa.csv.parser.js')
var fs = require('fs')
var iconv = require('iconv-lite');

program.version(require('./package.json').version)
    .usage('[yourJSON] [yourCsv]')
    .option('-e --encoding <encoding>', '编码', 'utf8')
    .option('-t --targetEncoding <encoding>', '目标文件编码', 'gb2312')
    .parse(process.argv)
if (program.args.length > 1) {
    var csvPath = path.resolve(process.cwd(), program.args[1])
    var jsonPath = path.resolve(process.cwd(), program.args[0])
    ;(async()=>{
        var json = fs.readFileSync(jsonPath)
        json = JSON.parse(iconv.decode(new Buffer(json) ,program.encoding))
        var csv = await p.toCsv(json)
        csv = iconv.encode(csv , program.targetEncoding)
        fs.writeFileSync(csvPath,csv)
        console.log('convert success : '+ csvPath)
    })()

}