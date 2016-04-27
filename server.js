/**
 * Created by ssukumaran on 9/5/2015.
 */
var express = require('express'),
   stores= require('./routes/stores');

var app = express();
app.configure(function () {
   app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
   app.use(express.bodyParser());
});
app.get('/stores/:brandId', stores.findAllStores);
app.get('/stores/:id',stores.findStoreById);
app.get('/stores/:lat/:longt/:brandId',stores.findStoreByNearestLocation);

app.listen(3000);
console.log('Listening on port 3000...');