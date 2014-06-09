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

        console.log('ccccccccccccc');
        setTimeout(SendMessage, 5)

    }