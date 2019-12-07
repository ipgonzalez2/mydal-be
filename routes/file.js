var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url');

path = require('path'),
  cors = require('cors'),
  multer = require('multer'),
  bodyParser = require('body-parser');



let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let useremail = req["headers"]["useremail"];
    let path = `./folders/${useremail}`;
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

let upload = multer({
  storage: storage
});


// GET polls listing

router.get('/:id', function (req, res, next) {
    console.log("hola");
  const token = req["headers"]["authorization"].split(" ")[1];
  //console.log(token);
  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      console.log(err)
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      let subquery='';
      if(req.params.id === 'null'){
          subquery = 'padre IS NULL';
          console.log(subquery);
      }else{
        subquery = 'padre="'+ req.params.id+'"';
      }
      res.locals.connection.query('SELECT * FROM fichero WHERE propietario="' + verifiedJwt["body"]["idUser"] + '" AND '+ subquery,
        function (error, results, fields) {
            console.log(error);
          if (error) {
            res.status(500);
            res.json({
              "status": 500,
              "error": error,
              "response": null
            });
            //If there is error, we send the error in the error section with 500 status
          } else {
            res.json({
              "status": 200,
              "error": null,
              "response": results
            });
            //If there is no error, all is good and response is 200OK.
          }
        });
    }
  });
});

router.post('/', upload.single('image'), function (req, res) {            
  const token = req["headers"]["authorization"].split(" ")[1];
  //console.log(token);
  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      console.log(err)
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else
      if(req["headers"]["folderid"] === 'null'){
        res.locals.connection.query('INSERT INTO FICHERO(NOMBRE, PROPIETARIO, FORMATO, COMPARTIR) values (?,?, ?, ?)',
        [req.file.originalname, verifiedJwt["body"]["idUser"], req.file.mimetype, "NO"],
        function (error, results) {
          console.log(results.insertId);
          console.log(req.file.url);
          if (error) {
            res.status(500);
            res.json({
              "status": 500,
              "error": error,
              "response": null
            });
            //If there is error, we send the error in the error section with 500 status
          } else {
            var oldName = `./folders/`+ req["headers"]["useremail"] + '/' + req.file.originalname;
            var newName = `./folders/`+ req["headers"]["useremail"] + '/(' + results.insertId + ')' + req.file.originalname;
            fs.renameSync(oldName, newName);
            res.json({
              "status": 201,
              "error": null,
              "response": results
            });
            console.log("creada");
            //If there is no error, all is good and response is 200OK.
          }
        });
      }else{
        res.locals.connection.query('INSERT INTO FICHERO(NOMBRE, PROPIETARIO, PADRE, FORMATO, COMPARTIR) values (?,?,?,?,?)',
        [req.file.originalname, verifiedJwt["body"]["idUser"], req["headers"]["folderid"], req.file.mimetype, "NO"],
        function (error, results) {
          
          if (error) {
            res.status(500);
            res.json({
              "status": 500,
              "error": error,
              "response": null
            });
            //If there is error, we send the error in the error section with 500 status
          } else {
            var oldName = `./folders/`+ req["headers"]["useremail"] + '/' + req.file.originalname;
            var newName = `./folders/`+ req["headers"]["useremail"] + '/(' + results.insertId + ')' + req.file.originalname;
            fs.renameSync(oldName, newName);
            res.json({
              "status": 201,
              "error": null,
              "response": results
            });
            console.log("subido");
            //If there is no error, all is good and response is 200OK.
          }
        });
      }

    
  });
          

});

router.get('/download/:id', function(req, res){
  const token = req["headers"]["authorization"].split(" ")[1];
  //console.log(token);
  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      console.log(err)
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else{ 
      res.locals.connection.query('SELECT NOMBRE from fichero where id_fichero='+ req.params.id + ' AND PROPIETARIO=' + verifiedJwt.body.idUser,
      function (error, results, fields) {
      console.log(results);
      if (error) {
        res.status(500);
        res.json({
          "status": 500,
          "error": error,
          "response": null
        });
        //If there is error, we send the error in the error section with 500 status
      } else if(results.length === 1) {
        var file = `./folders/`+ req["headers"]["useremail"] + '/(' + req.params.id + ')' +results[0]["NOMBRE"];
        console.log(file);
        res.download(file, req.params.name);
      }else{
      res.status(401);
      res.json({
      "status": 401,
      "error": err,
      "response": "You don't own this file"
       });
    }
    });  /*else {
       
      var file = `./folders/`+ req["headers"]["useremail"] + '/' +req.params.name;
      res.download(file, req.params.name);
                
    }*/
  }
});
});

router.post('/share/:id', function(req, res){
  const token = req["headers"]["authorization"].split(" ")[1];
  //console.log(token);
  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      console.log(err)
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else { 
      res.locals.connection.query('SELECT NOMBRE from fichero where id_fichero='+ req.params.id + ' AND PROPIETARIO=' + verifiedJwt.body.idUser,
        function (error, results, fields) {
  
          if (error) {
            res.status(500);
            res.json({
              "status": 500,
              "error": error,
              "response": null
            });
            //If there is error, we send the error in the error section with 500 status
          } else  if(results.length === 1) {
            res.locals.connection.query('UPDATE fichero SET compartir="' + "SI" + '" where id_fichero='+ req.params.id,
            function (error, results, fields) {
            if (error) {
            res.status(500);
            res.json({
              "status": 500,
              "error": error,
              "response": null
            });
            //If there is error, we send the error in the error section with 500 status
            } else {
            res.json({
              "status": 200,
              "error": null,
              "response": 'localhost:4000/api/v1/file/share/'+req.params.id
            });
            //If there is no error, all is good and response is 200OK.
          }
        });
        }else{
          res.status(401);
          res.json({
          "status": 401,
          "error": err,
          "response": "You don't own this file"
      });
        }
        });   
    }
  });
});

router.get('/share/:id', function(req, res){
  
      res.locals.connection.query('SELECT nombre,propietario from fichero where compartir="' + "SI" + '" and id_fichero='+ req.params.id,
      function (error, results, fields) {
        if (error) {
          res.status(500);
          res.json({
            "status": 500,
            "error": error,
            "response": null
          });
          //If there is error, we send the error in the error section with 500 status
        } else  if(results.length === 1) {
          nombre = results[0]["nombre"];
          propietario = results[0]["propietario"];
          res.locals.connection.query('SELECT email from usuario where id_usuario='+ propietario,
          function (error, results, fields) {
          if (error) {
          res.status(500);
          res.json({
            "status": 500,
            "error": error,
            "response": null
          });
          //If there is error, we send the error in the error section with 500 status
          } else {
           email = results[0]["email"]; 
           var file = `./folders/`+ email + '/(' + req.params.id + ')' + nombre;
           console.log(file);
           
          res.download(file, nombre);
          /*res.json({
            "status": 200,
            "error": null,
            "response": null
          });*/
          //If there is no error, all is good and response is 200OK.
        }
      });
      }else{
        res.status(401);
        res.json({
        "status": 401,
        "error": err,
        "response": "You don't own this file"
      });
      }
});
});

module.exports = router;
