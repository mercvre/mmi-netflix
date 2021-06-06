// SELECTORS
const viz = document.querySelector(".viz02");
const titreButton = document.querySelector("#titre");
const mediaButton = document.querySelector("#mediatype");
const productionButton = document.querySelector("#production");
const dateButton = document.querySelector("#date");
const ratingButton = document.querySelector("#rating");
const films = () => document.querySelectorAll(".film");
const soustitre = document.getElementById('soustitre');

let filmData;
let filmOfCurrentPage;

// EVENT LISTENERS
titreButton.addEventListener('click', (e) => getProperty(e, "title"));
mediaButton.addEventListener('click', (e) => getProperty(e, "type"));
productionButton.addEventListener('click', (e) => getProperty(e, "production"));
dateButton.addEventListener('click', (e) => getProperty(e, "year"));
ratingButton.addEventListener('click', (e) => getProperty(e, "imdbrating"));

// FUNCTIONS
function fromCSVtoObjectArray(fileLink){
    const allData = [];
    return fetch(fileLink)
    .then(response => response.text())
    .then(data => {
        let csv2json = data;
        let test = csv2json.split("\r\n");

        for (let i = 1; i < test.length; i++) {
            let uneligne = test[i].split(",");
            let element = {};
            element.netflixId = parseInt(uneligne[0]) ;
            element.count = parseInt(uneligne[1]);
            element.line = parseInt(uneligne[2]);
            element.column = parseInt(uneligne[3]);
            element.imdbId = uneligne[4];
            element.title = uneligne[5];
            element.production = uneligne[6] == "N" ? "Netflix" : "Other";
            element.type = uneligne[7];
            element.year = uneligne[8];
            element.imdbvotes = parseInt(uneligne[9]);
            element.imdbrating = parseFloat(uneligne[10]);
            element.coverlink = uneligne[11];

            if(!allData[element.line]){
                allData[element.line] = [];
            }
            if (!allData[element.line][element.column]){
                allData[element.line][element.column]= [];
            }

            allData[element.line][element.column].push(element);

            
            // allData.push(element);
        }

        return allData

    });
}

function addDivToFilmArray(filmArray){

    filmArray.forEach(a => {
        a.forEach(b => {
            if (b!= null){
                b.forEach(c => {
                    //create film div
                    const filmDiv = document.createElement('div');
                    filmDiv.classList.add('film');
    
                    //assign netflix id as ID to div
                    filmDiv.id = c.netflixId;
    
                    //create text element inside div
                    const filmP = document.createElement('p');
                    filmP.innerHTML = c.title;
                    filmDiv.appendChild(filmP);
    
                    //add it to filmArray
                    c.filmTag = filmDiv;
                })
            }
        })
    })
}

function getMostCount(filmArray) {
    const counts = [];
    for (let i = 0; i < filmArray.length; i++) {
        //get all the numbers of count
        let element = filmArray[i].count;
        counts.push(element);
    }
    return Math.max(...counts);
}

function getProperty(event, property){
    // event.preventDefault();

    //replace innerText by rating
    filmOfCurrentPage.forEach(f => {
        f.filmTag.children[0].innerText = f[property];
    })
}

function extractArrayFromFilmData(){
    let url = new URL(window.location.href);
    let line = url.searchParams.get("line");
    let column = url.searchParams.get("column");

    soustitre.innerText = `Qu'est que Netflix me propose en case ${parseInt(line)+0}:${parseInt(column)+1} ?`

    return filmData[line][column];
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
//download(jsonData, 'json.txt', 'text/plain');

import DATA from "../json.js";
// console.log(unTest);


// MAIN

// let dataArray = fromCSVtoObjectArray('../data.csv');
// dataArray.then(arrayOfFilms => {

//     // let arrayOfFilms = unTest;
//     console.log(arrayOfFilms);

//     //save data to JSON file
//     // download(JSON.stringify(arrayOfFilms), 'json.json', 'application/json');

//     //create div and add it to the array
//     addDivToFilmArray(arrayOfFilms);

//     //set global variable filmData so that it can be used in other functions
//     filmData = arrayOfFilms;

//     //get only the film of the current page
//     filmOfCurrentPage = extractArrayFromFilmData();

//     //get the most counts
//     let max = getMostCount(filmOfCurrentPage);

//     // add the divs to the body with a maximum of 6
//     for (let i = 0; i < (filmOfCurrentPage.length < 5 ? filmOfCurrentPage.length : 5) ; i++) {
//         //add to viz div
//         viz.appendChild(filmOfCurrentPage[i].filmTag);

//         filmOfCurrentPage[i].filmTag.style.width = filmOfCurrentPage[i].count/max * 100 +"%";
        
//     }

//     // arrayOfFilms.forEach((f, i) => {
//     //     viz.appendChild(f.filmTag);
//     // })

// });


let arrayOfFilms = DATA;

//create div and add it to the array
addDivToFilmArray(arrayOfFilms);

//set global variable filmData so that it can be used in other functions
filmData = arrayOfFilms;

//get only the film of the current page
filmOfCurrentPage = extractArrayFromFilmData();

//get the most counts
let max = getMostCount(filmOfCurrentPage);

// add the divs to the body with a maximum of 6
for (let i = 0; i < (filmOfCurrentPage.length < 5 ? filmOfCurrentPage.length : 5) ; i++) {
    //add to viz div
    viz.appendChild(filmOfCurrentPage[i].filmTag);

    filmOfCurrentPage[i].filmTag.style.width = filmOfCurrentPage[i].count/max * 100 +"%";
    
}

