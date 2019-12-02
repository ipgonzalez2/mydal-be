var express = require('express');
var router = express.Router();


// GET polls listing

router.get('/:id', function (req, res, next) {
  const token = req["headers"]["authorization"].split(" ")[1];
// console.log(token);
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
      }else{
        subquery = 'padre="'+ req.params.id+'"';
      }
      console.log(subquery);
      res.locals.connection.query('SELECT * FROM carpeta WHERE propietario="' + verifiedJwt["body"]["idUser"] + '" AND '+ subquery,
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
              "response": results
            });
            //If there is no error, all is good and response is 200OK.
          }
        });
    }
  });
});



module.exports = router;