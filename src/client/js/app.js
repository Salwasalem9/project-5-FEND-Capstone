const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    try {
      const newData = await response.json();
      return newData;
    } catch (error) {
      console.log('error', error);
    }
  };
  
  
function handleSubmit(event) {
  event.preventDefault();
  
  const destination = document.querySelector('#Destination-from').value;
  const star = document.querySelector('#start-Date').value;
  const end = document.querySelector('#end-Date').value;
 
// use Moment.js
const starMoment = moment(star, 'YYYY-MM-DD');
const endMoment = moment(end, 'YYYY-MM-DD');
let CountTrip = endMoment.diff(starMoment, 'days');
const DateNow = moment().format('YYYY-MM-DD');


  const dateInfo = {
    star: star,
    end : end ,
    CountTrip: CountTrip,
  };



  // Check if inputs are valid
  if (
    CountTrip <= 0 ||
    starMoment.isBefore(DateNow) ||
    endMoment.isBefore(DateNow)
  ){
    alert(`Please, enter valid dates.`);
  } 
  else {
  
    {
      Toastify({
        text: 'Your data is processing.',
        duration: 2500,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'rgba(98, 149, 156, 0.741)',
      }).showToast();
      console.log(star, end);
      postData('http://localhost:8000/results', {
        destination: destination,
      }).then((data) => {
        updateUI(data, dateInfo);
        // reset tge form
        document.querySelector('form').reset();
      });
    }
  } 
}
// Global varibale to count how many cards are posted
let cardsCountCreation = 0;

const updateUI = (data, dateInfo) => {
  console.log(data);
  const planSection = document.querySelector('#plans');
  let currentCard;




  // get cards
const card =  document.getElementsByClassName("card").innerHTML = `${cardsCountCreation}`;
  currentCard = card;

  

  // First (dates)
  const dates = document.getElementById("dates").innerHTML = `Your trip starts on <span>${dateInfo.star}</span><br> 
  And ends on <span>${dateInfo.end}</span> <br/> <span>${dateInfo.CountTrip}</span> days the length of the trip`;
 

  // Third (ImageCity)
  const ImageCity2 = document.getElementById("image");
  if (data.ImageCity === 'No images!') {
    ImageCity2.innerHTML = `<img src="" alt="No images found!" id="img-url">`;
  } else {
    ImageCity2.innerHTML = `<a href="${data.ImageCity}" > <img src="${data.ImageCity}" alt="${data.destination}" id="img-url"></a>`;
  }

  // Fourth div (#ForeseeWeather)
  const  TodayForesee =  document.getElementById("TodayForesee");
  const TodayForesee_p = document.getElementById("TodayForesee_p").innerHTML =("The weather today");
  const TodayForesee_tem = document.getElementById("TodayForesee_tem").innerHTML = `Temperature${data.temp}°C` ;
  
  const weatherIcons4 = document.getElementById("weatherIcons");
  weatherIcons4.setAttribute('src',`https://www.weatherbit.io/static/img/icons/${data.icon}.png`);

  const TodayForesee_des = document.getElementById("TodayForesee_des").innerHTML = (`${data.description}`);


  // loop for ForeseeWeather
  const ForeseeWeatherLoop = [ TodayForesee_p, TodayForesee_tem, weatherIcons4, TodayForesee_des, ];
  let i = 0;
  if ( i < ForeseeWeatherLoop.length) {
    appendNewEle(TodayForesee, ForeseeWeatherLoop[i]);
    i++;
  }


  
  const foresee_weather = document.getElementById("foresee_weather");

  const foresee_p0 = document.getElementById("foresee_p").innerHTML = ("forecast of 16 days");

  const foresee_temp1 = document.getElementById("foresee_temp").innerHTML =
   `Average Temperature<br><span>${data.avgTemp} °C</span>`;

  const foresee_maxTemp2 = document.getElementById("foresee_maxTemp").innerHTML = 
  `Max Temperature<br><span>${data.maxTemp} °C</span>`;

  const foresee_minTemp3 = document.getElementById("foresee_minTemp").innerHTML =
    `Min Temperature<br><span>${data.minTemp} °C</span>`;
 
  // loop for Foresee_weather
  const prdictedAppendList = [ foresee_p0, foresee_temp1, foresee_maxTemp2, foresee_minTemp3, ];
  for (let i = 0; i < prdictedAppendList.length; i++) {
    appendNewEle(foresee_weather, prdictedAppendList[i]);
  }


  // Sixth div (#planning)
  let planningDiv = '';
  if (planning.textLength > 0) {
    planningDiv = createNewEle('div', 'planning-result', `${planning.value}`);
  }
  // Delete card button
  const button = createNewEleClass(
    'button',
    `button card${cardsCountCreation}`,
    '<i class="fas fa-times"></i>'
  );
  // I tried for 6 hours straight to use event listener to do this
  // then I stumbled upon https://stackoverflow.com/a/64226108/14869876 and he saved me
  button.setAttribute('onclick', 'return this.parentNode.remove();');
  const eleList = [
    cityCountry,
    dates,
    destination_image,
    currentforecast,
    predictedforecast,
    button,
  ];
  if (planning.textLength > 0) {
    eleList.splice(eleList.length - 1, 0, planningDiv);
  }

  // Appending the card to the page
  appendNewEle(planSection, currentCard);
  for (let i = 0; i < eleList.length; i++) {
    appendNewEle(currentCard, eleList[i]);
  }
  cardsCountCreation = cardsCountCreation + 1;
};
// Event listener to delete cards

// Credit: https://stackoverflow.com/a/57589712/14869876
function lowerCase(str) {
  return str
    .split(' ')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(' ');
}

// function to create new elements with ID
function createNewEle(tag, type, content) {
  const newEle = document.createElement(`${tag}`);
  newEle.setAttribute('id', `${type}`);
  newEle.innerHTML = `${content}`;
  return newEle;
}
function createNewEleClass(tag, type, content) {
  const newEle = document.createElement(`${tag}`);
  newEle.setAttribute('class', `${type}`);
  newEle.innerHTML = `${content}`;
  return newEle;
}

function appendNewEle(parent, child) {
  parent.appendChild(child);
}

export { handleSubmit };