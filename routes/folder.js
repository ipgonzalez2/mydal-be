var express = require('express');
var router = express.Router();


// GET polls listing
router.get('/', function (req, res, next) {
  

      res.locals.connection.query('SELECT * FROM carpeta WHERE propietario=' +2,
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

});



module.exports = router;