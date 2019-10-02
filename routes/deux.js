var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var fs = require('fs');

// var system = require('app');  ///!!!!!!!!!!!!!!!!!
// var path = system.hostdata;
//var names =new Array();
var num_r = 0;
var token_q = new Array();
var token_p = new Array();
var given = new Array();
var user_id = new Array();

var ids_records = new Array();
var count_record = 0;
/* test.xml */

var  identits= new Array();

	for(var j=0; j<count_record; j++)   // !!!!!!!!!!!!
	{
	 identits[j] = new Array();	
	}
	
router.get('/', function(req, res, next) {
 //  res.send('respond with a resource');


    var  file;
  file = "./metadata/test.xml";
  fs.readFile(file,'ascii',function(err,data){
    if(err){
      res.write('page introuvable');
    }
    else{
      res.writeHead(200,{"content-type": "text/xml"});
      res.write(data);
    }
    res.end();
  });
});




router.use('/:userid/:anyid/listrecords', function(req, res){
	
	 function remplissage(ids_records){
    path = hostdata();
    var $;
    var filees = [],
        name_ident,
        dir=path+'records';

    // res.writeHead(200,{"content-type": "text/xml"});
    fs.readdir(dir,function(err,filees) {   // remplir le tableau files avec les noms des fichies
        var i=0;
        filees.forEach(function (content){
             file = dir +'/'+content;  //mettre nom de fichie dans la variable file
            fs.readFile(file,'ascii',function(err,data){
                $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
                name_ident = $("identifier").text();
                ids_records[i] = name_ident;
                i++;
                if (i == filees.length) {
                    //;
               }
            });

        });
    });
    };
              // res.write(ids_records[0]);
	          var livred_name = new Array();   //§!!!!!!!!!!!!!!!!!!!!!!!!!!
     // recupere l'etat de reprise pour un utilisateur pour donné la suite
	         if( req.params.userid != 0){  //c'est t'a dire dés que un token de request arrive
			 for(var a =0 ;a< token_p.length;a++)
			 {
				 if( token_res_saisir = token_p[a]){   //le token passé a partir de request
					
					  var value = given[a];
					 var value2 = given[a] + 4;
					 if(value2 > ids_records.length){  //depassé le nombre max des enrigstrements
					       var value3 = value2 -9;
						   var give_me =  4 - value3;
					 }else{
						   var give_me = 4;						 
					 }
					   //   list_identity_by_(ids_records , param,num_r);
						 livred_name =  livre(a,give_me);  // autre parameter utilisé qui sont global user_id[] identits[][]
						   // 'a' mean si on arrive au dernier token envoyé (reponse) correspnd au token recu (request)
				 }
			 }
			 }
	num_r++;

    path = hostdata();
 // res.send(req.params.userid); // affiche id_user
  var $;
  var files = [],
      Record,
      dir=path+'records',
      listId='<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/ http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd">';
  listId += '<responseDate></responseDate>';
  listId += '<request verb="Listrecords" metadataPrefix="oai_dc"></request>';
  listId += '<ListRecords>';

  res.writeHead(200,{"content-type": "text/xml"});
  fs.readdir(dir,function(err,files) {   // remplir le tableau files avec les noms des fichies
    var i=0;
    files.forEach(function (content){
      file = dir +'/'+content;  //mettre nom de fichie dans la variable file
      fs.readFile(file,'ascii',function(err,data){
        if(err){
          res.write('page introuvable');
        }
        else{
             $= cheerio.load(data, { xmlMode: false,normalizeWhitespace: false });
			 
			 ids_records[count_record] = $("identifier").text();  //acces to file + verifie l'identifier si 
			 var identfier = $identfier                 //ids _records contient les noms des identfier
			 count_record++;
			 // identfier != boucle des deja delivred de user given(user,i,1)
			 for(var b=0;b <livred_name.length;b++){
            if (livred_name[b] = identfier) { 
			Record = $("Record").html();
            listId +='<Record>';
            listId+=Record;
            listId+='</Record>';
            i++;
			 }
			}
        }
          if (i == files.length) {
              listId += '<resumptionToken completeListSize="'+i+'">'+i+'</resumptionToken>';
              listId +='</ListRecords>';
              listId += '</OAI-PMH>';
              res.write(listId);
              res.end();
          }
      });

    });
	


// le journal d'un transaction : écrire dans les tableaus de transaction (request , reponse) 
	for(var iter=0;iter<num_r;iter++){
		user_id[num_r] =req.params.userid;
		if(user_id[iter] != req.params.userid){
			token_q[num_r] = 0;
			token_p[num_r] = 'any_id ??'  // choisir la valeur a donne au token_p
			given[num_r] = 4;             // parameter : le nombre d'enrigstrement a donne
			
			
		}else if(tokens_reponse(token_q[num_r] /* donner par user :traiter */) != 0){
			user_id[num_r] = user_id[iter];
			token_q[num_r] = 'aaaa'// choisir par user que deja effectuer des requests;
			token_p[num_r] = 'any_id ??' ; // choisir la valeur a donne au token_p
			given[num_r] = given[iter] + 4; 
		}
		identits[num_r] = livred_name  // list_identity_by_(ids_records,4,num_r);   //retourner les 4 identifiant de la request
	}



  });



});

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// le journal d'un transaction : écrire 
function tokens_reponse(value){
	var index = 0;
	for(var i =1 ;i < num_r;i++){
		if( token_q[i] = token_q[num_r]){
			index = i;
			break;
		}
	}
	return index;
}
function list_identity_by_(ids_records , param,num_r){
	var valeurs = new Array();   //§!!!!!!!!!!!!!!!!!!!!!!!!!!
	for(var j=0; j<param; j++)
	{
	 valeurs[j] = new Array();	
	}
	var k= 0;
    for(var a=0;a <num_r-1;a++){  //compare les identits de requests avec 
		for(var j = 0 ; j < ids_records.length ; j++ ){
			for(var b = 0 ; b < param ; b++ ){	
			if(ids_records[j] != identits[k][a] ){			
				var value = identits[a][b];
				if(value != ids_records[j]){
				//	identits[num_r][k] = ids_records[j];
					valeurs= ids_records[j]
					if( k < param ){
						k++
					}else {
						break;
					}
				}
			}
			}
		}
	
	}
	return valeurs;//!!! []
    
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
