    console.info('The client side script is starting to execute...');

    var stationstatusvalue = document.getElementById('stationstatusvalue');
    var stationnotif = document.getElementById('stationnotif');

    function SendMessage() {
        var returned_message = MessagePump({
            status: stationstatusvalue.value
        });
        var returned_data = JSON.parse(returned_message);
        stationnotif.innerHTML = returned_data.notify;
        console.log(returned_data)
    }

    function ChangeStatus() {
        stationnotif.innerHTML = 'Sending new status...';
        //we do a timeout call her because soem networks are slow and we 
        //do not know if and when our return message will get to us..
        setTimeout(SendMessage, 5)
    }