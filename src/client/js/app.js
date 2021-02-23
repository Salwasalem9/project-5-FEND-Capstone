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
  
  const destination = document.querySelector('#destination-from').value;
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
      }).
      showToast();
      console.log(star, end);
      postData('http://localhost:8081/results', {
        destination: destination,
      }).then((data) => {
        updateUI(data, dateInfo);
        // reset form
        document.querySelector('form').reset();
      });
    }
  } 
}



const updateUI = (data, dateInfo) => {
  console.log(data);

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

// pulling a the forecast for multiple days.
  const foresee_p0 = document.getElementById("foresee_p").innerHTML = ("forecast of 15 days");
  const foresee_high = document.getElementById("foresee_high").innerHTML = 
  `High <br><span>${data.high} °C</span>`;
  const foresee_low = document.getElementById("foresee_low").innerHTML =
    `Low<br><span>${data.low} °C</span>`;
}

export { handleSubmit };