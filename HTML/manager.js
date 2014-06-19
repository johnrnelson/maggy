console.info('The client side script is starting to execute...')


var HEART_BEAT = 1000; //1 second...
var SERVER_BEAT_COUNT = 4; //8 beats at 1 beat per second would be...


function RefreshStatuses() {
    var returned_message = MessagePump({
        request: 'refresh'
    });
    var returned_data = JSON.parse(returned_message);
    ProcessStatus(returned_data);
}


function GetStatuses() {
    var returned_message = MessagePump({
        request: 'statusupdate'
    });
    var returned_data = JSON.parse(returned_message);
    ProcessStatus(returned_data);
}


//Loop through the list of stations we have and do somethign with it...
function ProcessStatus(StatusData) {
    for (var itemID in StatusData) {
        var aSingleStation = StatusData[itemID];
        SetStationStatus(aSingleStation);
    }
    console.log('Heart Beat :' + new Date());
}


//Change our HTML values to reflect the chages made from a station...
function SetStationStatus(Station) {
    // debugger;
    var stationHTMLElement;

    //Each station has its own ID both in our own model and the document object model (DOM)...
    stationHTMLElement = document.getElementById(Station.id);

    //If there is not already an HTML element for our station, build a new one and start using it...
    if (!stationHTMLElement) {
        stationHTMLElement = BuildBrandNewStationHTMLElement(Station.id);
    }

    //console.dir(Station);


    //Server sends data as text, so convert it to a real date for comparrison...
    var udate = new Date(Station.udate);

    stationHTMLElement.address.innerHTML = Station.name;
    stationHTMLElement.address.title = udate;

    stationHTMLElement.onclick = function(e) {
        test(stationHTMLElement)
    }

    stationHTMLElement.status.innerHTML = Station.status;
    BounceHTMLElement(stationHTMLElement.status)




    //build the station container for all of the stations information...
    function BuildBrandNewStationHTMLElement(ElementID) {
        var htmlElement_station = document.createElement('station');
        var htmlElement_address = document.createElement('address');
        var htmlElement_status = document.createElement('status');
        htmlElement_station.id = ElementID;

        htmlElement_station.className = 'animated';
        htmlElement_address.className = 'animated';
        htmlElement_status.className = 'animated';

        htmlElement_station.appendChild(htmlElement_address);
        htmlElement_station.appendChild(htmlElement_status);

        htmlElement_station.address = htmlElement_address;
        htmlElement_station.status = htmlElement_status;


        function CreateStatusDetails(StatusHTMLElement) {

            var htmlElement_statusText = document.createElement('statustext');
            var htmlElement_statusDetails = document.createElement('statusdetails');
            htmlElement_statusText.statustext = statustext;

            htmlElement_statusText.innerHTML = Station.status;
            htmlElement_statusDetails.innerHTML = 'Status Details:';

            htmlElement_statusText.appendChild(htmlElement_statusDetails);
            StatusHTMLElement.appendChild(htmlElement_statusText);

            StatusHTMLElement.statusdetails = htmlElement_statusDetails;
            StatusHTMLElement.statustext = htmlElement_statusText;

        }

        //finnally.... add this bad boy to the html element that was definded in the host page...
        document.getElementById('stationlist').appendChild(htmlElement_station);
        return htmlElement_station;

    }




} //end SetStationStatus......

/* 
Lets get all station information at one time. This usualy happens when you refresh the page or 
are debugging...
*/
RefreshStatuses();



var myBeatCount = 0;
setInterval(function() {
    myBeatCount++;

    if (myBeatCount > SERVER_BEAT_COUNT) {
        myBeatCount = 0; //reset the beat count...

        GetStatuses();
    }
}, HEART_BEAT); //Set how many seconds to wait between each heartbeet...



// anything past this point is testing or playing around...
function BounceHTMLElement(element) {
    element.style.color = 'yellow';
    element.classList.add('flipInX');
    setTimeout(function() {
        element.classList.remove('flipInX');
        element.style.color = 'white';
    }, 3000);
}