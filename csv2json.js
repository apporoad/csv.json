#!/usr/bin/env node

var program = require('commander');
var path = require('path')
const p = require('lisa.csv.parser.js')
var fs = require('fs')
var iconv = require('iconv-lite');
var find = require('find');

program.version(require('./package.json').version)
    .usage('[yourCsvOrDir] [yourJson]')
    .option('-e --encoding <encoding>', '编码', 'gb2312')
    .option('-t --targetEncoding <encoding>', '目标文件编码', 'utf8')
    .parse(process.argv);
if (program.args.length > 1) {
    var csvPath = path.resolve(process.cwd(), program.args[0])
    var jsonPath = path.resolve(process.cwd(), program.args[1])
    //文件情况
    if(fs.statSync(csvPath).isFile()){
        var csv = fs.readFileSync(csvPath)
        csv = iconv.decode(new Buffer(csv),program.encoding)
        // console.log(csv)
        var json = p.toJson(csv)
        json = iconv.encode(JSON.stringify(json), program.targetEncoding)
        fs.writeFileSync(jsonPath,json)
        console.log('convert success :' + jsonPath)
    }
    //文件夹方式
    else{
        var files = find.fileSync(/\.csv$/ , csvPath)
        var alljson = {}
        for(var i =0;i<files.length;i++){
            var csvFile = files[i]
            var fname = path.basename(csvFile)
            var ext = path.extname(csvFile)
            fname = fname.substring(0,fname.length - ext.length)
            var csv = iconv.decode(new Buffer(fs.readFileSync(csvFile)),program.encoding)
            var json = p.toJson(csv)
            alljson[fname] = json
        }
        alljson = iconv.encode(JSON.stringify(alljson), program.targetEncoding)
        fs.writeFileSync(jsonPath,alljson)
        console.log('convert success :' + jsonPath)
    }

}