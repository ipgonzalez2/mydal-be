var express = require('express');
var router = express.Router();


// GET polls listing
router.get('/author', function (req, res, next) {
  const token = req["headers"]["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      res.locals.connection.query('SELECT * FROM polls WHERE author="' + verifiedJwt["body"]["user_id"] + '"',
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

router.get('/participations', function (req, res, next) {
  const token = req["headers"]["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      res.locals.connection.query('SELECT * FROM polls p, gaps g, assignations a WHERE p.poll_id=g.poll_id AND g.gap_id=a.gap_id AND a.user_id="' + verifiedJwt["body"]["user_id"] + '"',
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

// GET poll by url
router.get('/:url', function (req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      res.locals.connection.query('SELECT * FROM polls WHERE url="' + req.params.url.toUpperCase() + '"',
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

// POST poll
router.post('/', function (req, res) {
  const token = req["headers"]["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      var md5 = require('md5');
      const url = md5(req.body.title + "Hashing text" + req.body.place);
      res.locals.connection.query('INSERT INTO polls (title, place, author, url) VALUES (?,?,?,?)',
        [req.body.title, req.body.place, verifiedJwt["body"]["user_id"], url.toUpperCase()],
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
            res.header("Location", "localhost:4200/gaps/add/" + url.toUpperCase());

            res.json({
              "status": 201,
              "error": null,
              "response": url.toUpperCase()
            });
            //If there is no error, all is good and response is 200OK.
          }
        });
    }
  });
});

// PUT poll
router.put('/', function (req, res) {
  const token = req["headers"]["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      var md5 = require('md5');
      const url = md5(req.body.title + "Hashing text" + req.body.place);
      res.locals.connection.query('UPDATE polls SET title="' + req.body["title"] + '", place="' + req.body["place"] + '" WHERE poll_id = ' + req.body["poll_id"] + ' AND author="' + verifiedJwt["body"]["user_id"] + '"',
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
            res.json({
              "status": 200,
              "error": null,
              "response": url.toUpperCase()
            });
            //If there is no error, all is good and response is 200OK.
          }
        });
    }
  });
});

// DELETE poll by url
router.delete('/:url', function (req, res, next) {
  const token = req["headers"]["authorization"].split(" ")[1];

  nJwt.verify(token, secretKey, function (err, verifiedJwt) {
    if (err) {
      res.status(401);
      res.json({
        "status": 401,
        "error": err,
        "response": null
      });
    } else {
      res.locals.connection.query('DELETE FROM polls WHERE url="' + req.params.url + '" AND author="' + verifiedJwt["body"]["user_id"] + '"',
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