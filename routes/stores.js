/**
 * Created by ssukumaran on 9/5/2015.
 */
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('storelocator', server);

db.open(function(err, db) {
    if(!err) {

        db.collection('stores', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'stores' collection doesn't exist. Creating it with sample data...")
            }
        });
    }
});

exports.findStoreById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving store: ' + id);
    db.collection('stores', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllStores = function(req, res) {
    db.collection('stores', function(err, collection) {
        collection.find({'brandId':req.brandId}).toArray(function(err, items) {
            res.send(items);
        });
    });
};
//Always list coordinates in longitude, latitude order.
//http://docs.mongodb.org/manual/reference/command/geoNear/
exports.findStoreByNearestLocation=function(req, res) {
    //res.send({lat:req.params.lat,longt:req.params.longt, name: "The Name", description: "description"});

    db.collection('stores').aggregate([
            {
                "$geoNear": {
                    "near": {
                        "type": "Point",
                        "coordinates": [parseFloat(req.params.longt), parseFloat(req.params.lat)]
                    },
                    "distanceField": "distance",
                    "spherical": true,
                    "limit":5,
                    "query": { "brandId": parseInt(req.params.brandId) }
                }
            }
        ],
        function(err, docs) {
            console.log(docs);
            console.log(err);
            res.json(docs);
        });

}