var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require('fs');


var  identits= new Array();

	for(var j=0; j< 20; j++)   // !!!!!!!!!!!!
	{
	 identits[j] = new Array();	
	}

 var num_r = 0;
 var num_t = 0;
var token_q = new Array();
var token_p = new Array();
var given =   new Array();
var fro = new Array();
var unt = new Array();
var user_id = new Array();
var list_type = new Array();
var nums_record = [1,2,3,4,5,6,7,8,9,10];
var nums_set = [1,2,3,4,5,6,7,8,9,10];

router.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getrecord', function(req, res, next) {
  res.render('getrecord', { title: 'Express' });
});

router.get('/listsets', function(req, res, next) {
  res.render('listsets', { title: 'Express' });
});

router.get('/listrecords', function(req, res, next) {
  res.render('listrecords', { title: 'Express' });
});

router.get('/identify', function(req, res, next) {
  res.render('identify', { title: 'Express' });
});

router.get('/Lformat', function(req, res, next) {
  res.render('lmdataformat', { title: 'Express' });
});

router.use('/', function(req, res){
    num_r++;
    num_t++;
    var verb = req.query.verb;             //listrecord
    var prefix = req.query.metadataPrefix; //
    var resumptionToken = req.query.resumptionToken;	
	var identifier  = req.query.identifier;   //getrecord	
	var from_ = req.query.from;
	var until = req.query.until;
    path = hostdata();
	
	  if(verb.toLowerCase() ==='listmetadataformats'.toLowerCase()){
       var metad='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
         metad += '<responseDate></responseDate>';
         metad += '<request verb="listmetadataformats" metadataPrefix="oai_dc"></request>';
         metad += '<listmetadataformats>';

       file = path +'/listmetadataformats.xml';
          fs.readFile(file,'ascii', function(err, data){

            if(err) {res.write("page introuvable");}
            else {
              $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
              metad+=$("listmetadataformats").html();
              res.writeHead(200,{"content-type": "text/xml"});
            }
            metad+='</listmetadataformats>';
            metad+='</OAI-PMH>';
            res.write(metad);
            res.end();
          });
     }else if(verb.toLowerCase() ==='getrecord'.toLowerCase()){
       var files = [],
         dir=path+'records',
         idrecord, v=0;
         var Record ='<?xml version="1.0" encoding="UTF-8"?>';
           Record='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
           Record += '<responseDate></responseDate>';

       fs.readdir(dir,function(err,files){
         var i=0;
         files.forEach(function (content){
         file = dir +'/'+content;
          fs.readFile(file,'ascii', function(err, data){
            if(err){ res.write('page introuvable');res.writeHead(200,{"content-type": "text/xml"});
            }
            else{
              $ = cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
              idrecord = $("identifier").text();
              if (idrecord== identifier) {
                Record += '<request verb="GetRecord" identifier="'+idrecord +'" metadataPrefix="oai_dc"></request>';
                Record += '<GetRecord>';
                Record+=$("GetRecord").html();
                Record+='</GetRecord>';
                Record+='</OAI-PMH>';
                res.writeHead(200,{"content-type": "text/xml"});
                res.write(Record);
                res.end();
                v = 1;
              }i++;
            }
            if (i == files.length && v==0) {
                  res.writeHead(200,{"content-type": "text/html"});
                  res.write('identifier inexistant ');
                  res.end();
            }
          });

         });
       });

     }else if(verb.toLowerCase() === 'identify'.toLowerCase()){

      var identify ='<?xml version="1.0" encoding="UTF-8"?>';
        identify='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
        identify += '<responseDate></responseDate>';
        identify += '<request verb="identify" metadataPrefix="oai_dc"></request>';
        identify += '<identify>';

        file = path + "/identify.xml";
        fs.readFile(file,'ascii',function(err,data){
           if(err){
               res.write('page introuvable');
           }
           else{
             $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
             identify+=$("identify").html();
               res.writeHead(200,{"content-type": "text/xml"});
           }
           identify+='</identify>';
           identify+='</OAI-PMH>';
           res.write(identify);
           res.end();
         });
     }else if(verb.toLowerCase() === 'listrecords'.toLowerCase()){
		var give_me;
		var filees = [];
		var valeurs = new Array();
		  var ids_records = new Array();
	      var date_records = new Array();
		   var $;
		  var Record;
		// var times_vals = new Array();
        dir=path+'records';
     var listId='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
     listId += '<responseDate></responseDate>';
     listId += '<request verb="Listrecords" metadataPrefix="oai_dc"></request>';
     listId += '<ListRecords>';
	           if(from_ == undefined && until == undefined){
	                  var ind = tokens_reponse(resumptionToken);
                     from_ = fro[ind];
                     until = unt[ind];
			   }
	 
     res.writeHead(200,{"content-type": "text/xml"});
     fs.readdir(dir,function(err,filees) {   // remplir le tableau files avec les noms des fichies
        var i=0,z=0;

        filees.forEach(function (content){
            file = dir +'/'+content;  //mettre nom de fichie dans la variable file

            fs.readFile(file,'ascii',function(err,data){
                $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
		
                         
				 var datestamp = $("datestamp").text();
				  var into = betwen(from_,until,datestamp);
				 if(into == true){  
				        ids_records[z] = $("identifier").text();  
					 	date_records[z] = $("datestamp").text();
						z++;
				 }
                i++;

                if (i == filees.length) {
                    if( resumptionToken == undefined) {  //c'est t'a dire dés que un token de request arrive

                            give_me = 4;
                            i = nums_record.length,
							j = 0;
							j = Math.floor(Math.random() * (i+1));
							user_id[num_r-1] = nums_record[j];
							nums_record.splice(j,1);




                    }else if (resumptionToken != undefined){
						for (var a = 0; a < token_p.length; a++) {
                        if( resumptionToken == token_p[a]){

                            var value = given[a];
                            var value2 = given[a] + 4;
                            if(value2 > ids_records.length){  //depassé le nombre max des enrigstrements
                                var value3 = value2 -9;
                                var give_me =  4 - value3;
                            }else {
                                give_me = 4;
                            }
                         }
						}


                    }

                    var k= 0; var lent =ids_records.length  ;
                    for(var m =0;m <lent;m++){
                         var drapeau = 0;
                        if( k < give_me ){

                        for(var a = 0 ; a < num_r-1 ; a++ ){
                                var pos = tokens_reponse(resumptionToken);

                            if(  user_id[pos] == user_id[a] &&  'listrecords' == list_type[a]){
                                    for(b = 0 ; b < identits[a].length; b++ ){
									if(ids_records[m] == identits[a][b]  ){
                                            drapeau = 1;
									}
                                }
                            }
                        }
                            if(drapeau != 1){
                                for(var j=0 ; j<k;j++){
                                    if(valeurs[j] == ids_records[m]){
                                        drapeau = 1;
                                    }
                                }
                            }
                            var bol = betwen(from_,until,date_records[m]);
                            if(drapeau == 0 && bol == true){
                                valeurs[k] = ids_records[m];
                                k++;
                            }

                        }
                    }


                    identits[num_r-1] = valeurs ;


					console.log(user_id[num_r-1]+'|');
	                console.log(identits[num_r-1])
					////////////////////////////
                         var p=0;
    filees.forEach(function (content){
      file = dir +'/'+content;
      fs.readFile(file,'ascii',function(err,data){
        if(err){
         res.write('page introuvable');
        }
        else{
             $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
			 var identfier = $("identifier").text();
			 for(var b=0;b <valeurs.length;b++){
            if (valeurs[b] == identfier) {
			Record = $("Record").html();
            listId +='<Record>';
            listId+=Record;
            listId+='</Record>';
            p++;
			 }
			}
        }

          if (p != valeurs.length) {
          } else {  //regler le dans le test

              if ( resumptionToken == undefined ) {
                  token_q[num_r - 1] = undefined;
                  token_p[num_r - 1] = "token"+num_t; // + user_id[num_r-1];  // choisir la valeur a donne au token_p
                  given[num_r - 1] = give_me;            // parameter : le nombre d'enrigstrement a donne
				  fro[num_r-1] = from_;
                  unt[num_r-1] = until;
              } else if (resumptionToken != undefined) {
                  var index = tokens_reponse(resumptionToken);
                  if (index != -1) {
                      user_id[num_r - 1] = user_id[index];
                      token_q[num_r - 1] = resumptionToken;// choisir par user que deja effectuer des requests;
                      token_p[num_r - 1] = "token"+num_t;
                      given[num_r - 1] = given[index] + give_me;
					  fro[num_r-1] = fro[index];
                      unt[num_r-1] = unt[index];
                  }
              }


              list_type[num_r-1] = 'listrecords';

			  if(give_me == 4 ){
				  cur = given[num_r-1] - 4;
				var  resumption = 'token'+num_t;
			  }else{
				  cur =  given[num_r-1] - give_me;
				var  resumption = "";
			  }


              listId += '<resumptionToken completeListSize="' + ids_records.length+'" cursor="'+cur+'" >'+resumption+'</resumptionToken>';
              listId += '</ListRecords>';
              listId += '</OAI-PMH>';



              // if(give_me < 4){

                  // var nom =  user_id[num_r-1];


                  // user_id.splice(num_r-1,1);
                  // token_p.splice(num_r-1,1);
				  // token_q.splice(num_r-1,1);
				  // identits.splice(num_r-1,1);
				  // given.splice(num_r-1,1);
                  // var sup = 1;
                  // for(var f = 0 ;f < user_id.length ;f++){
                      // if(nom == user_id[f] ){
                           // user_id.splice(f, 1);
						   // token_p.splice(f,1);
				           // token_q.splice(f,1);
				           // identits.splice(f,1);
				           // given.splice(f,1);
                          // sup++;
                      // }
                  // }
                  // num_r = num_r-sup;
              // }
              res.end(listId);
          }
      });
    }
    );


                }
            });

        });

    });
    }else if(verb.toLowerCase() === 'listsets'.toLowerCase()){
            var $;
		  var set;		   
		   var filees = [];
			var give_me;
		var ids_sets = new Array();
	    var date_sets = new Array();
		var valeurs = new Array();
		 dir=path+'sets';
     var listId='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
     listId += '<responseDate></responseDate>';
     listId += '<request verb="Listsets" metadataPrefix="oai_dc"></request>';
     listId += '<Listsets>';
	 if(from_ == undefined && until == undefined){
	                  var ind = tokens_reponse(resumptionToken);
                     from_ = fro[ind];
                     until = unt[ind];
			   }
     res.writeHead(200,{"content-type": "text/xml"});
     fs.readdir(dir,function(err,files) {   // remplir le tableau files avec les noms des fichies
        var i=0,z=0;

        files.forEach(function (content){
            file = dir +'/'+content;  //mettre nom de fichie dans la variable file

            fs.readFile(file,'ascii',function(err,data){
                $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
				       
				 var datestamp = $("datestamp").text();  //ajoute dans l'entrepot
				  var into = betwen(from_,until,datestamp);
				 if(into == true){  
				         ids_sets[z] = $("setName").text();     
					 	date_sets[z] = $("datestamp").text();
						z++;
				 }
                i++;
                if (i == files.length) {
                    if( resumptionToken == undefined) {  //c'est t'a dire dés que un token de request arrive
                    
                        give_me = 4;
                         i = nums_set.length;
							j = 0;

							j = Math.floor(Math.random() * (i+1));
							user_id[num_r-1] = nums_set[j];
							nums_set.splice(j,1);							

                    }else if (resumptionToken != undefined){
						for (var a = 0; a < token_p.length; a++) {
                        if( resumptionToken == token_p[a]){
                            	user_id[num_r-1] = 3; //!!!
                            var value = given[a];
                            var value2 = given[a] + 4;
                            if(value2 > ids_sets.length){  //depassé le nombre max des enrigstrements
                                var value3 = value2 -11;
                                var give_me =  4 - value3;
                            }else {
                                give_me = 4;
                            }
                         }
						}
                    }

                    //   valeurs = new Array(4);  for(var j=0; j< 4/*count_record */; j++)   // !!!!!!!!!!!!{    valeurs[j] = 0;}
                    var k= 0; var lent =ids_sets.length  ;
                    for(var m =0;m <lent;m++){  //compare les identits de requests avec
                         var drapeau = 0;                       
					   if( k < give_me ){
                        
                        for(var a = 0 ; a < num_r-1 ; a++ ){

                                var pos = tokens_reponse(resumptionToken);
                            if(  user_id[pos] == user_id[a] &&  'listsets' == list_type[a]  ){
                                    for(b = 0 ; b < identits[a].length; b++ ){
                                        if(ids_sets[m] == identits[a][b]){
                                            drapeau = 1;
                                        }
                                }
                            }
                         }
                            if(drapeau!= 1){
                                for(var j=0 ; j<k;j++){
                                    if(valeurs[j] == ids_sets[m]){
                                        drapeau = 1;
                                    }
                                }
                            }
                            var bol = betwen(from_,until,date_sets[m]);
                            if(drapeau == 0 && bol == true ){
                                valeurs[k] = ids_sets[m];
                                k++;
                            }

                        }
                    }
					
                     identits[num_r-1] = valeurs ;
                     console.log(user_id[num_r-1]);
				     console.log(identits[num_r-1]+'/n');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                         var p=0;
    files.forEach(function (content){
      file = dir +'/'+content;  
      fs.readFile(file,'ascii',function(err,data){
        if(err){
         res.write('page introuvable');
        }
        else{
             $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
			 var setname = $("setName").text();                  
			 for(var b=0;b <valeurs.length;b++){
            if (valeurs[b] == setname) {
			set = $("set").html();
            listId +='<set>';
            listId+=set;
            listId+='</set>';
            p++;
			 }
			}
        }

          if (p != valeurs.length) {
          } else {  //regler le dans le test

              if ( resumptionToken == undefined ) {

                 
                  token_q[num_r - 1] = undefined;
                  token_p[num_r - 1] = "token"+num_t; //  + user_id[num_r-1];  // choisir la valeur a donne au token_p
                  given[num_r - 1] = give_me;            // parameter : le nombre d'enrigstrement a donne
                  fro[num_r-1] = from_;
                  unt[num_r-1] = until;

              } else if (resumptionToken != undefined) {
                  var index = tokens_reponse(resumptionToken);
                  if (index != -1) {
                      user_id[num_r - 1] = user_id[index];
                      token_q[num_r - 1] = resumptionToken;// choisir par user que deja effectuer des requests;
                      token_p[num_r - 1] = "token"+num_t;
                      given[num_r - 1] = given[index] + give_me;
					   fro[num_r-1] = fro[index];
                       unt[num_r-1] = unt[index];
                  }
              }
			  
              list_type[num_r-1] = 'listsets';
			  
			   if(give_me == 4 ){
				  cur = given[num_r-1] - 4;
				var  resumption = 'token'+num_t;
			  }else{
				  cur =  given[num_r-1] - give_me; 
				var  resumption = "";
			  }
			   
			  
              listId += '<resumptionToken completeListSize="' + ids_sets.length+'" cursor="'+cur+'" >'+resumption+'</resumptionToken>';
              listId += '</Listsets>';
              listId += '</OAI-PMH>';


              // if(give_me < 4){

                  // var nom =  user_id[num_r-1];
                  // user_id.splice(num_r-1,1);
                  // token_p.splice(num_r-1,1);
				  // token_q.splice(num_r-1,1);
				  // identits.splice(num_r-1,1);
				  // given.splice(num_r-1,1);
                  // var sup = 1;
                  // for(var f = 0 ;f < user_id.length ;f++){
                      // if(nom == user_id[f] ){
                           // user_id.splice(f, 1);
						   // token_p.splice(f,1);
				           // token_q.splice(f,1);
				           // identits.splice(f,1);
				           // given.splice(f,1);
                          // sup++;
                      // }
                  // }
                  // num_r = num_r-sup;
              // }
              

              res.end(listId);
             
          }
      });

    }
    );
                }
            });

        });

    });
	
	}
	
});


function betwen(from_,until,date){
	      if (from_ != undefined && until != undefined) {     // la date de debut jusqu'a la date fin definir par l'utlisateur
           var fyear= from_[0]+from_[1]+from_[2]+from_[3],
               fday=from_[8]+from_[9],fmonth=from_[5]+from_[6],
            date,year1,day1,month1,
            uyear=until[0]+until[1]+until[2]+until[3],
            uday=until[8]+until[9],umonth=until[5]+until[6];
         }
         else if (from_ != undefined ){
          var fyear= from_[0]+from_[1]+from_[2]+from_[3],
           fday=from_[8]+from_[9],fmonth=from_[5]+from_[6],
           date,year1,day1,month1;
         }
         else if (until != undefined) {
           var uyear=until[0]+until[1]+until[2]+until[3],
           uday=until[8]+until[9],umonth=until[5]+until[6],
           date,year1,day1,month1;
         }
	      var bol = false;
		 if (until != undefined && from_ != undefined) {
                  year1 = date[0]+date[1]+date[2]+date[3];
                  month1= date[5]+date[6];
				  day1=date[8]+date[9];
				    if (fyear == uyear) {
                    if ((fmonth<month1 || fmonth==month1) && (umonth==month1 || umonth>month1)){
                     bol = true;
                    }
                  }
                  else if (fyear<year1 && year1<uyear){
                     bol = true;
                  }
                  else if (year1 == fyear) {
                    if (fmonth<month1){
                       bol = true;
					   }
                    else if (fmonth == month1 ) {
                      if (fday< day1 || fday==day1){
                        bol = true;                       
                      }
                    }
                  }
                  else if (year1==uyear) {
                    if (umonth>month1){
                    bol = true;
                    }
                    else if (umonth == month1) {
                      if (uday> day1 || uday==day1){
                       bol = true;
                      }
                    }
                  }
		        
		}else if (from_ != undefined) {
			      year1 = date[0]+date[1]+date[2]+date[3];
                  month1= date[5]+date[6];day1=date[8]+date[9];
                  if (fyear<year1){
                        bol = true;
                  }
                  else if (year1 == fyear) {
                    if (fmonth<month1){
                        bol = true;
                    }
                    else if (fmonth == month1) {
                      if (fday< day1 || fday==day1){
                        bol = true;
                      }
                    }
		        }  
		}else if(until != undefined) {
                  year1 = date[0]+date[1]+date[2]+date[3];
                  month1= date[5]+date[6];day1=date[8]+date[9];
                  if (year1<uyear){
                        bol = true;
                  }
                  else if (year1 == uyear) {
                    if (umonth>month1){
                        bol = true;
                    }
                    else if (umonth == month1) {
                      if (uday> day1 || uday==day1){
                        bol = true;
                      }
                    }
                  }
                }
                else {
                        bol = true;
                } 
				  return bol; 
}

function tokens_reponse(value){
	var index = -1;
	for(var i =0 ;i < num_r-1;i++){
		if( token_p[i] == value){
			index = i;
			break;
		}
	}
	return index;
}


function hostdata(){
    path = require('path');
    var file;
    file = path.dirname(__dirname)+'/data/systemfile.xml';
    var data = fs.readFileSync(file,'ascii'),
        $ = cheerio.load(data, { xmlMode: false,normalizeWhitespace: false }),
        adr = $("urldata").text();
    return adr;
}

module.exports = router;
