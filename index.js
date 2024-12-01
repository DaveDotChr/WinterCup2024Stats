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

var allScores;
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
        if (ascent.top == true) {
          newascents.push(ascent);
        }
      })
      element.ascents = newascents;
    });
    allScores = test;
  });
});
setTimeout(() => {
  fetch("http://localhost:3000/userRankingsWomen").then((response) => {
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
          if (ascent.top == true) {
            newascents.push(ascent);
          }
        })
        element.ascents = newascents;
        allScores.push(element);
      });
    });
  });
}, 4000);


setTimeout(() => {
  console.log(allScores.length);
  if (allScores.length == 189) {
    fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      body: JSON.stringify(allScores),
      headers: {
        "X-Master-Key": "$2a$10$T9cXxdkbsA9nyuWxq.IgKuObJ3nQSFa7O8jInyy2sAWB36YFYVpaS",
        "Content-Type": "application/json",
        "X-Bin-Name": "athleteScores"
      }
    }).then((response) => {
      response.text().then(text => {
        console.log(text);
      })
    })
  }
}, 6000);

