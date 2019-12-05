var express = require('express');
var router = express.Router();

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
    } else {
      res.locals.connection.query('INSERT INTO FICHERO(NOMBRE, PROPIETARIO, PADRE, FORMATO, COMPARTIR) values (?,?,?,?,?)',
      [req.file.filename, req["headers"]["userid"], req["headers"]["folderid"], req.file.mimetype, "NO"],
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
          
              
/*
  console.log(req.file);
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false
    });

  } else {
    console.log('File is available!');
    return res.send({
      success: true
    })
  }*/
});



module.exports = router;