#!/usr/bin/env node

var program = require('commander');
var path = require('path')
const p = require('lisa.csv.parser.js')
var fs = require('fs')
var iconv = require('iconv-lite');

program.version(require('./package.json').version)
    .usage('[yourCsv] [yourJson]')
    .option('-e --encoding <encoding>', '编码', 'gb2312')
    .option('-t --targetEncoding <encoding>', '目标文件编码', 'utf8')
    .parse(process.argv);
if (program.args.length > 1) {
    var csvPath = path.resolve(process.cwd(), program.args[0])
    var jsonPath = path.resolve(process.cwd(), program.args[1])
    var csv = fs.readFileSync(csvPath)
    csv = iconv.decode(new Buffer(csv),program.encoding)
    // console.log(csv)
    var json = p.toJson(csv)
    json = iconv.encode(JSON.stringify(json), program.targetEncoding)
    fs.writeFileSync(jsonPath,json)
    console.log('convert success :' + jsonPath)
}