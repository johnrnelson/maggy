// Here we have all the code we need to describe what should happen for this application..

var fs = require('fs');


//Holds in memory the stuf we need to work with all the time...
var stations = {
    STATIONS: [],

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
                if ( stationDate>ldate ) {
                    updated.push(aSingleStation);
                }
            }

        }
        return updated;
    }
};


//Anyone using this module can access the our stations object
//by going through the exports... 
exports.Stations = stations;

