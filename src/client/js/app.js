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
 
// use Moment.js for format dates
const starMoment = moment(star, 'YYYY-MM-DD');
const endMoment = moment(end, 'YYYY-MM-DD');
let count_days_Trip = endMoment.diff(starMoment, 'days');
const dateNow = moment().format('YYYY-MM-DD');


 const dateInfo = { star: star, end : end ,count_days_Trip: count_days_Trip, };



  // Check if inputs dates are valid
  if (
    count_days_Trip <= 0 ||
    starMoment.isBefore(dateNow) ||
    endMoment.isBefore(dateNow)
  ){
    alert(`Please enter valid dates.`);
  } 
  else {
  
    {
      Toastify({
        text: 'Your data is processing.',
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: 'top',
        position: 'center',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      }).showToast();
      console.log(star, end);
      postData('http://localhost:8000/results', {
        destination: destination,
      }).then((data) => {
        updateUI(data, dateInfo);
        // reset form
        document.querySelector('form').reset();
      });
    }
  } 
}

// Global varibale to count how many cards are posted
let cardsCount = 0;

const updateUI = (data, dateInfo) => {
  console.log(data);
  let currentCard;




  // get cards
const card =  document.getElementsByClassName("card").innerHTML = `${cardsCount}`;
  currentCard = card;

  

  // First (dates)
  const dates = document.getElementById("dates").innerHTML = `Your trip starts on <span>${dateInfo.star}</span><br> 
  And ends on <span>${dateInfo.end}</span> <br/> <span>${dateInfo.count_days_Trip}</span> days the length of the trip`;
 

  // Third (ImageCity)
  const ImageCity2 = document.getElementById("image");
  if (data.ImageCity === 'No images!') {
    ImageCity2.innerHTML = `<img src="" alt="No images found!" id="img-url">`;
  } else {
    ImageCity2.innerHTML = `<a href="${data.ImageCity}" > <img src="${data.ImageCity}" alt="${data.destination}" id="img-url"></a>`;
  }

  // Fourth div (#ForeseeWeather)
  const  todayForesee =  document.getElementById("todayForesee");
  const todayForesee_p = document.getElementById("todayForesee_p").innerHTML =("The weather today");
  const todayForesee_tem = document.getElementById("todayForesee_tem").innerHTML = `Temperature${data.temp}°C` ;
  
  const weatherIcons4 = document.getElementById("weatherIcons");
  weatherIcons4.setAttribute('src',`https://www.weatherbit.io/static/img/icons/${data.icon}.png`);

  const todayForesee_des = document.getElementById("todayForesee_des").innerHTML = (`${data.description}`);


  // loop for ForeseeWeather
  const foreseeWeatherLoop = [ todayForesee_p, todayForesee_tem, weatherIcons4, todayForesee_des, ];
  let i = 0;
  if ( i < foreseeWeatherLoop.length) {
    appendChild(todayForesee, foreseeWeatherLoop[i]);
    i++;
  }

// pulling a the forecast for multiple days.
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
  let g = 0;
  if ( g < prdictedAppendList.length) {
    appendChild(foresee_weather, prdictedAppendList[i]);
    i++;
  }


}

export { handleSubmit };