/*
This is generic code that just abuot any application can use....
 */
function MessagePump(Message) {
    var ActualResponseText = '';
    try {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('PUT', window.location.href, false);
        xmlhttp.setRequestHeader('station_type', 'desk');
        xmlhttp.send(JSON.stringify(Message));
        ActualResponseText = xmlhttp.responseText;
    } catch (e) {
        alert('The network seems to be unavailable. Nothing will work now. :-(')
        console.error(e);
        ActualResponseText = e;
    }
    // console.info(ActualResponseText);
    //Now finnally we return our finished result...
    return ActualResponseText;
}


function onUpdateReady() {
    //console.info('Manifest changed so new version of file will be added to teh cache!!!!!');
}
window.applicationCache.addEventListener('updateready', onUpdateReady);
if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
    onUpdateReady();
}