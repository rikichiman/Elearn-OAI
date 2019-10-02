/* global _dirname */

   var fs = require('fs'),
     path = require('path'),
     cheerio = require('cheerio'),
    file;


       function hostdata(){
         file = path.dirname(__dirname)+'/data/systemfile.xml';
         var data = fs.readFileSync(file,'ascii'),
         $ = cheerio.load(data, { xmlMode: false,normalizeWhitespace: false }),
         adr = $("urldata").text();
         return adr;
       }
       function  hostname(){
         file = path.dirname(__dirname)+'/data/systemfile.xml';
         var data = fs.readFileSync(file,'ascii'),
         $ = cheerio.load(data, { xmlMode: false,normalizeWhitespace: false }),
         adr = $("repositoryname").text();
         return adr;
       }
        function  hostrepository(){
         file = path.dirname(__dirname)+'/data/systemfile.xml';
         var data = fs.readFileSync(file,'ascii'),
         $ = cheerio.load(data, { xmlMode: false,normalizeWhitespace: false }),
         adr = $("urlrepository").text();
         return adr;
       }


module.exports = hostdata;

