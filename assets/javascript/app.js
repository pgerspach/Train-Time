$(document).ready(function(){
    
    var config = {
        apiKey: "AIzaSyBn4YG94WtJwKRTCKwRD7RlFvtVj99-DJ4",
        authDomain: "trains-a0ef3.firebaseapp.com",
        databaseURL: "https://trains-a0ef3.firebaseio.com",
        projectId: "trains-a0ef3",
        storageBucket: "trains-a0ef3.appspot.com",
        messagingSenderId: "202710220430"
      };
      firebase.initializeApp(config);
      var database = firebase.database();

      $(".subButton").on("click", function(event) {
        event.preventDefault();
      
        // Grabbed values from text boxes
        var name = $("#inputTrainName")
          .val()
          .trim();
        var dest = $("#inputDestination")
          .val()
          .trim();
        var time = $("#inputTrainTime")
          .val()
          .trim();
        var freq = $("#inputTrainFreq")
          .val()
          .trim();
      
        // Code for handling the push
        database.ref().push({
          name: name,
          dest: dest,
          time: time,
          freq: freq,
        });
        $("#inputTrainName").val("");
        $("#inputDestination").val("");
        $("#inputTrainTime").val("");
        $("#inputTrainFreq").val("");
      
      });

      database.ref().on("child_added", function(snapshot){
        var name = snapshot.child("name").val();
        var dest = snapshot.child("dest").val();
        var time = snapshot.child("time").val().trim();
        var freq = `${snapshot.child("freq").val()*60}`; // freq in seconds
        var tTimeUnix = moment(time, "hh:mm").format('x'); // train time in ms
        var cTimeUnix = moment().format('x'); // current time in ms
        console.log(tTimeUnix);
        var diff = `${(cTimeUnix-tTimeUnix)/1000}`; // difference in seconds

        var toNext = Math.round(Number(`${freq - (diff%freq)}`)*1000); // time (in ms) to next train
        
        var nextTime = moment(String(Number(cTimeUnix)+toNext), 'x').format("hh:mm a");
        if(Number(diff)<0){
            nextTime = moment(time, 'hh:mm').format("hh:mm a");
            toNext = String((Number(diff)*-1)*1000);
        }
        console.log(nextTime);

        var tableRow = $("<tr>");
        var nameData = $("<td>");
        nameData.html(`${name}`);
        var timeData = $("<td>");
        timeData.html(`${time}`);
        var destData = $("<td>");
        destData.html(`${dest}`);
        var freqData = $("<td>");
        freqData.html(`${freq/60}`);
        var nextData = $("<td>");
        nextData.html(`${nextTime}`);
        var awayData = $("<td>");
        awayData.html(`${Math.ceil(toNext/1000/60)}`);


        tableRow.append(nameData, destData, freqData, nextData, awayData);
        
        $(".trainTable").append(tableRow);
      })
})