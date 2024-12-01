var athletes = new Map;

// fetch("http://localhost:3000/userRankingsMen").then((response) => {
//   response.json().then((test) => {
//     test.forEach(element => {
//       athletes.set(element.id, element.name)
//     });  
//   });

// });

// fetch("http://localhost:3000/userRankingsWomen").then((response) => {
//   response.json().then((test) => {
//     test.forEach(element => {
//       athletes.set(element.id, element.name)
//     });  
//   });

// });

// setTimeout(() => {
//   console.log(JSON.stringify(Object.fromEntries(athletes)));
// }, 5000);


fetch("http://localhost:3000/userRankingsMen").then((response) => {
  response.json().then((test) => {
    
    test.forEach(element => {
      var newascents = [];
      element.ascents.forEach(ascent => {
        delete ascent.route_id;
        delete ascent.zone;
        delete ascent.zone_tries;
        delete ascent.low_zone;
        delete ascent.points;
        delete ascent.modified;
        delete ascent.status;
        delete ascent.low_zone_tries;
        if(ascent.top == true){
          newascents.push(ascent); 
        }
      })
      element.ascents = newascents;
    });
    console.log(test);
    
    console.log(JSON.stringify(test).length);
     

    fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      body: JSON.stringify(test),
      headers: {
        "X-Master-Key": "$2a$10$T9cXxdkbsA9nyuWxq.IgKuObJ3nQSFa7O8jInyy2sAWB36YFYVpaS",
        "Content-Type": "application/json"
      }
    }).then((response) => {
      response.text().then(text => {
        console.log(text);
        
      })
      
    })
      
  });

});



// var rankingsWomen = fetch("http://localhost:3000/userRankingsWomen");


// rankingsMen = JSON.parse(rankingsMen);

// rankingsMen.forEach(element => {
//   console.log("test");
  
// });