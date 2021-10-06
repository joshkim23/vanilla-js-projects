var firstObject = {
    name: "Andrew",
    age: "30",
    ethnicity: "white",
    siblings: ["beth", "paul", "rach"],
    parents: {
        mom: "Teresa",
        Dad: "Mark"
    },
    schoolInfo: {
        university: "University of washington",
        degree: "Mechanical Engineering",
        level: "Bachelors"
    },
    blah: {
        blah2: {
            blah3: {

            }
        },
        blah2a: {

        }
    }
}



var bikeData: {
    RPM: [],
    power: [],
    time: []
}

let instantRPM;
let instantPower;
let instantTime;
let testRunning = true;

while (testRunning) {
    instantRPM = currentTestData.RPM
    bikeData.RPM.push(instantRPM);
    bikeData.power.push(instantPower);

}