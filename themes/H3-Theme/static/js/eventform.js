/*
 *  openTab() -
 */
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // assure that the calendar has loaded in
    if (tabName == 'Selection') {
        $("#datepicker").datepicker({
            onSelect: findEvents,
            minDate: new Date()
        });

        // open up to todays date
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        }
        if (mm < 10) {
          mm = '0' + mm;
        }
        var today = mm + '/' + dd + '/' + yyyy;
        findEvents(today);
    }
}




/*
 *  validateNumber() - will make sure that the key press event is only numbers
 */
function validateNumber(evt) {
  var theEvent = evt || window.event;

  // Handle paste
  if (theEvent.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
  } else {
  // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
  }
  var regex = /[0-9]|\./;
  if( !regex.test(key) ) {
    theEvent.returnValue = false;
    if(theEvent.preventDefault) theEvent.preventDefault();
  }
}





/*
 *  updateReceiptCheckbox() - adds or removes the item/cost to the receipt and updates the total
 */
function updateReceiptCheckbox(checkbox, item, cost, reference) {
    var totalCost = document.getElementById("receipt-total").innerHTML;
    totalCost = parseFloat(totalCost.slice(8));
    cost = parseFloat(cost);
    if (checkbox.checked == true) {
        addToReceipt(item, cost, reference);
        totalCost += cost;
    } else {
        deleteFromReceipt(item);
        totalCost -= cost;
   }
   document.getElementById("receipt-total").innerHTML = "Total: €" + Number(totalCost).toFixed(2);
}


/*
 *  updateReceiptAmount() - adds or removes the item/cost to the receipt and updates the total
 */
function updateReceiptAmount(input, item, cost, reference) {
    // see if already in table, get count if it is
    var receiptTable = document.getElementById("receipt-table");
    for (var i = 1; i < receiptTable.rows.length; i++) {
        var row = receiptTable.rows[i];
        var values = row.cells[0].innerHTML.split(" ");
        var currCount = input.value;
        if (values[0] == item) {
            // if the item is in the table
            var pastCount = values[1].slice(1, -1);

            // update the receipt total
            var totalCost = document.getElementById("receipt-total").innerHTML;
            totalCost = parseFloat(totalCost.slice(8));
            totalCost += (currCount - pastCount) * cost;
            document.getElementById("receipt-total").innerHTML = "Total: €" + Number(totalCost).toFixed(2);

            if (currCount == 0 || currCount == null) {
                // remove from the receipt if there is a zero count
                deleteFromReceipt(item + " (" + pastCount + ")");
            } else {
                // update the receipt entry by deleting it and readding it
                deleteFromReceipt(item + " (" + pastCount + ")");
                addToReceipt(item + " (" + currCount + ")", currCount * cost, reference);
            }
            break;
        }
        if (i == receiptTable.rows.length - 1) {
            // if the item is not in the table, add it
            addToReceipt(item + " (" + currCount + ")", currCount * cost, reference);
            // add to the total
            var totalCost = document.getElementById("receipt-total").innerHTML;
            totalCost = parseFloat(totalCost.slice(8));
            totalCost += currCount * cost;
            document.getElementById("receipt-total").innerHTML = "Total: €" + Number(totalCost).toFixed(2);
            break;
        }
    }
}


/*
 *  updateReceiptSpace() -
 */
function updateReceiptSpace(checkbox, space, type, cost, reference) {
    var receiptTable = document.getElementById("receipt-table");

    for (var i = 1; i < receiptTable.rows.length; i++) {
        var row = receiptTable.rows[i];
        var item = row.cells[0].innerHTML;
        var currCount;
        if (item.includes(space + " " + type)) {
            // if the item is in the table
            var pastCount = parseFloat(item.substring(item.indexOf('(') + 1, item.indexOf(')')));
            // update the receipt total
            var totalCost = document.getElementById("receipt-total").innerHTML;
            totalCost = parseFloat(totalCost.slice(8));

            if (checkbox.checked == true) {
                currCount = pastCount + 1;
            } else {
                currCount = pastCount - 1;
            }
            totalCost += (currCount - pastCount) * cost;
            document.getElementById("receipt-total").innerHTML = "Total: €" + Number(totalCost).toFixed(2);

            if (currCount == 0 || currCount == null) {
                // remove from the receipt if there is a zero count
                deleteFromReceipt(space + " " + type + " (" + pastCount + ")");
            } else {
                // update the receipt entry by deleting it and readding it
                deleteFromReceipt(space + " " + type + " (" + pastCount + ")");
                addToReceipt(space + " " + type + " (" + currCount + ")", currCount * cost, reference);
            }
            break;
        }
        if (i == receiptTable.rows.length - 1) {
            // if the item is not in the table, add it
            addToReceipt(space + " " + type + " (1)", cost, reference);
            // add to the total
            var totalCost = document.getElementById("receipt-total").innerHTML;
            totalCost = parseFloat(totalCost.slice(8));
            totalCost += cost;
            document.getElementById("receipt-total").innerHTML = "Total: €" + Number(totalCost).toFixed(2);
            break;
        }
    }
}


/*
 *  addToReceipt() - adds a row to the table with the given item and cost
 */
function addToReceipt(item, cost, reference) {
    var receiptTable = document.getElementById("receipt-table");
    var rowCnt = receiptTable.rows.length;        // GET TABLE ROW COUNT.
    var tr = receiptTable.insertRow(rowCnt);      // TABLE ROW.
    tr.className = reference;
    tr.onclick = function() { openTab(event, reference) };


    var td0 = document.createElement('td');          // TABLE DEFINITION.
    td0 = tr.insertCell(0);
    td0.innerHTML = item;
    var td1 = document.createElement('td');          // TABLE DEFINITION.
    td1 = tr.insertCell(1);
    td1.innerHTML = "€" + Number(cost).toFixed(2); ;
}

/*
 *  deleteFromReceipt() - removes the row with the given value from the recipt table
 */
function deleteFromReceipt(item) {
    var receiptTable = document.getElementById("receipt-table");
    for (var i = 1; i < receiptTable.rows.length; i++) {
        var row = receiptTable.rows[i];
        var value = row.cells[0].innerHTML;
        console.log(value + ", " + item)
        if (value == item) {
            receiptTable.deleteRow(i);
            break;
        }
    }
}








/*
 *  reviewApplication() -
 */
function reviewApplication() {
    /*const title = document.createElement('h3');
    title.textContent = "Review and Submit Request";

    // insert more data (date, venue, all other id's)

    document.getElementById("Review").innerHTML = "";
    document.getElementById("Review").appendChild(title);*/
}










/* DYNAMICALLY CREATE AND LOAD HTML ELEMENTS */


// only load the events database reference once
var eventsRef = firebase.database().ref().child("Events");






/*
 * findEvents() - will populate the available venues on date selection
 */
function findEvents(dateText) {
    // clear the available venues and add the current searching date
    const dateChosen = document.createElement('h5');
    dateChosen.textContent = "Available spaces for " + dateText;

    document.getElementById("available-venues").innerHTML = "";
    document.getElementById("available-venues").appendChild(dateChosen);

    // add all venue spaces to the available venues
    eventsRef.on("child_added", snap => {
        // create the image cell
        const eventImage = document.createElement('img');
        eventImage.className = "card-image";
        eventImage.setAttribute("src", snap.child("image").val());
        eventImage.setAttribute("alt", "");
        const imageCell = document.createElement('div');
        imageCell.className = "image-cell";
        imageCell.appendChild(eventImage);

        // create the title cell
        const title = document.createElement('h5');
        let eventName = snap.child("name").val();
        title.textContent = eventName;
        const titleCell = document.createElement('div');
        titleCell.className = "title-cell";
        titleCell.appendChild(title);

        // create the description cell
        const description = document.createElement('ul');
        description.className = "event-description";
        snap.child("description").val().forEach(function(childNode){
            // This loop iterates over children of description
            const bullet = document.createElement('li');
            bullet.textContent = childNode;
            description.appendChild(bullet);
        });
        const descriptionCell = document.createElement('div');
        descriptionCell.className = "description-cell";
        descriptionCell.appendChild(description);


        // create the time cell
        // see what times are taken
        let takenTimes = new Array();
        if (snap.child("events").val()) {
            // if there are events listed for this venue
            for (let item in snap.child("events").val()) {
                // check for the selected date
                if (dateText == snap.child("events").val()[item].date) {
                    // add all times to the taken times array
                    for (let takenTime of snap.child("events").val()[item].times) {
                        takenTimes.push(takenTime);
                    }
                }
            }
        }
        // list all of the available times
        let timeAvailable = false;
        // create halfday/fullday section
        const specialCol = document.createElement('div');
        specialCol.className = "col";
        const specialTimes = document.createElement('ul');
        // create morning slot
        if (!(takenTimes.includes(9) || takenTimes.includes(10) || takenTimes.includes(11) || takenTimes.includes(12))){
            const bullet = document.createElement('li');

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = eventName + " morn";
            checkbox.onclick = function() { updateReceiptSpace(this, eventName, "Morning Half", 20, "Selection"); };

            var label = document.createElement('label')
            label.htmlFor = eventName + " morn";
            label.appendChild(document.createTextNode("9:00 - 13:00"));

            // add checkbox and label to li, then add to ul
            bullet.appendChild(checkbox);
            bullet.appendChild(label);
            specialTimes.appendChild(bullet);
        }
        // create evening slot
        if (!(takenTimes.includes(13) || takenTimes.includes(14) || takenTimes.includes(15) || takenTimes.includes(16))){
            const bullet = document.createElement('li');

            var checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = eventName + " even";
            checkbox.onclick = function() { updateReceiptSpace(this, eventName, "Evening Half", 20, "Selection"); };

            var label = document.createElement('label')
            label.htmlFor = eventName + " even";
            label.appendChild(document.createTextNode("13:00 - 17:00"));

            // add checkbox and label to li, then add to ul
            bullet.appendChild(checkbox);
            bullet.appendChild(label);
            specialTimes.appendChild(bullet);
        }
        // create fullday slot
        if (!(takenTimes.includes(9) || takenTimes.includes(10) || takenTimes.includes(11) || takenTimes.includes(12) ||
            takenTimes.includes(13) || takenTimes.includes(14) || takenTimes.includes(15) || takenTimes.includes(16))){
                const bullet = document.createElement('li');

                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = eventName + " full";
                checkbox.onclick = function() { updateReceiptSpace(this, eventName, "Full day", 35, "Selection"); };

                var label = document.createElement('label')
                label.htmlFor = eventName + " full";
                label.appendChild(document.createTextNode("9:00 - 17:00"));

                // add checkbox and label to li, then add to ul
                bullet.appendChild(checkbox);
                bullet.appendChild(label);
                specialTimes.appendChild(bullet);
        }
        const specialTitle = document.createElement('h6');
        specialTitle.textContent = "Special Hours";
        specialCol.appendChild(specialTitle);
        specialCol.appendChild(specialTimes);

        // create business section
        const businessCol = document.createElement('div');
        businessCol.className = "col";
        const businessTimes = document.createElement('ul');
        for (let t = 8; t <= 17; t++) {
            if (!takenTimes.includes(t)) {
                timeAvailable = true;
                const bullet = document.createElement('li');

                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = eventName + " " + t;
                checkbox.onclick = function() { updateReceiptSpace(this, eventName, "Business Hours", 10, "Selection"); };

                var label = document.createElement('label')
                label.htmlFor = eventName + " " + t;
                label.appendChild(document.createTextNode(t + ":00 - " + ((t+1)%24) + ":00"));

                // add checkbox and label to li, then add to ul
                bullet.appendChild(checkbox);
                bullet.appendChild(label);
                businessTimes.appendChild(bullet);
            }
        }
        const businessTitle = document.createElement('h6');
        businessTitle.textContent = "Business Hours";
        businessCol.appendChild(businessTitle);
        businessCol.appendChild(businessTimes);

        // create nightly section
        const nightlyCol = document.createElement('div');
        nightlyCol.className = "col";
        const nightlyTimes = document.createElement('ul');
        for (let t = 18; t <= 23; t++) {
            if (!takenTimes.includes(t)) {
                timeAvailable = true;
                const bullet = document.createElement('li');

                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.id = eventName + " " + t;
                checkbox.onclick = function() { updateReceiptSpace(this, eventName, "After Hours", 10, "Selection"); };

                var label = document.createElement('label')
                label.htmlFor = eventName + " " + t;
                label.appendChild(document.createTextNode(t + ":00 - " + ((t+1)%24) + ":00"));

                // add checkbox and label to li, then add to ul
                bullet.appendChild(checkbox);
                bullet.appendChild(label);
                nightlyTimes.appendChild(bullet);
            }
        }
        const nightlyTitle = document.createElement('h6');
        nightlyTitle.textContent = "Nightly Hours";
        nightlyCol.appendChild(nightlyTitle);
        nightlyCol.appendChild(nightlyTimes);

        // add sections to time cell
        const timeCell = document.createElement('div');
        timeCell.className = "time-cell row";
        timeCell.appendChild(specialCol);
        timeCell.appendChild(businessCol);
        timeCell.appendChild(nightlyCol);


        // if there is at least one time available, add all grid cells to the venue grid, then add it to the available venues
        if (timeAvailable) {
            const venueGrid = document.createElement('div');
            venueGrid.className = "venue-grid my-card";
            venueGrid.appendChild(imageCell);
            venueGrid.appendChild(titleCell);
            venueGrid.appendChild(descriptionCell);
            venueGrid.appendChild(timeCell);
            document.getElementById("available-venues").appendChild(venueGrid);
        }
    })

    //document.getElementById("available-venues").setAttribute("style", "-webkit-animation: fadeIn 1s;animation: fadeIn 1s;");
}
