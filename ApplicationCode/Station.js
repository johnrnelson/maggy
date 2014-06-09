// Here we have all the code we need to describe what should happen for this application..

var fs = require('fs');


//Holds in memory the stuf we need to work with all the time...
var stations = {
    STATIONS: [],
    // Add: function(StationInformation) {
    //     this.STATIONS.push(new station(StationInformation))
    // },
    Remove: function (Station) {
    },
    Notify: function (Station) {
    },

    //To look things up.. lets pass in all we know about the request...
    Lookup: function (StationIPAddress) {
        for (var i = this.STATIONS.length - 1; i >= 0; i--) {
            var aSingleStation = this.STATIONS[i];
            if (aSingleStation.address == StationIPAddress) {
                return aSingleStation;
            }
        }

        //Well... since we did not find it, lets just add it..

        var aSingleStation = {
            //A blueprint of what a station should look and behave like...
            address: StationIPAddress,
            status: 'Welcome!',
            cdate: new Date().toISOString(),
            udate: new Date().toISOString(),
            notify:'Ok you are all set to use this tool'
        };
        this.STATIONS.push(aSingleStation);
        return aSingleStation;
    },
    GetUpdates:function(LastDateChecked){
        var updated=[];
        if(!LastDateChecked){
            return updated;
        }
        for(var station in ApplicationData.stations){
            var aSingleStation = ApplicationData.stations[station];
            if (!aSingleStation.id){

            }else{
                var stationDate = new Date(aSingleStation.udate);
                var ldate = new Date(LastDateChecked);
//                var timediff = Math.abs(ldate-stationDate);
//                var timediff = (ldate-stationDate);

                if ( stationDate>ldate ) {
                    updated.push(aSingleStation);
                }
            }

        }
//        for (var i = ApplicationData.stations.length - 1; i >= 0; i--) {
//            var aSingleStation = ApplicationData.stations[i];
//            if (aSingleStation.udate > LastDateChecked) {
//                updated.push(aSingleStation);
//            }
//        }
        return updated;
    }
};


//Anyone using this module can access the our stations object
//by going through the exports... 
exports.Stations = stations;


//exports.ApplicationData = function () {
//    try {
//        var config = fs.readFileSync('MAGGY.json', 'utf8');
//        return JSON.parse(config);
//    } catch (e) {
//        console.log(e);
//        throw("Error reading config file...")
//    }
//}
/*
 This is async so no waiting ...
 HOWEVER!! If you change the HTML pages then you must rerun the script so you
 can see yoru changes..
 */
exports.ReadHTMLAllAtOnece = function () {

    //You can read any file type you want.. HTML is utf8 but we could 
    //just as easily serve up a movie.. lol
    fs.readFile('HTML/station.html', 'utf8', function (err, data) {
        if (err) {

        } else {
            stations.HTMLStation = data;
        }
    });

    fs.readFile('HTML/manager.html', 'utf8', function (err, data) {
        if (err) {

        } else {
            stations.HTMLManager = data;
        }
    });

}