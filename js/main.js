const form = document.querySelector(".offcanvas .offcanvas-body form");
const input = document.querySelector(".offcanvas .offcanvas-body input");
const msg = document.querySelector(".offcanvas .offcanvas-body .msg");
const list = document.querySelector(".ajax-section .cities");
//API
const apiKey = "2916a282be3e2c482deccfce943a8cc5";

form.addEventListener("submit", e => {
    e.preventDefault();
    //lectura del valor del input
    let inputVal = input.value;
  
    //checa si hay ciduad en la lista
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
  
    if (listItemsArray.length > 0) {
      const filteredArray = listItemsArray.filter(el => {
        let content = "";
        //athens,gr
        if (inputVal.includes(",")) {
          //athens,grrrrrr->si el codigo de ciduad es invlido, solo toma el primer valor del input
          if (inputVal.split(",")[1].length > 2) {
            inputVal = inputVal.split(",")[0];
            content = el.querySelector(".city-name span").textContent.toLowerCase();
          } else {
            content = el.querySelector(".city-name").dataset.name.toLowerCase();
          }
        } else {
          //athens
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        }
        return content == inputVal.toLowerCase();
      });
  
      if (filteredArray.length > 0) {
        msg.textContent = `Ya sabes el clima para ${
          filteredArray[0].querySelector(".city-name span").textContent
        } ...de lo contrario, sea más específico proporcionando el código de país también 😉`;
        form.reset();
        input.focus();
        return;
      }
    }
  
    //peticion a la api
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const { main, name, sys, weather } = data;
        const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
          weather[0]["icon"]
        }.svg`;
  
        const li = document.createElement("li");
        li.classList.add("city");
        li.classList.add("animate__animated");
        li.classList.add("animate__fadeInDown");
        ///li.setAttribute("data-aos", "zoom-in");
        const markup = `
          <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
            <img class="city-icon" src="${icon}" alt="${
          weather[0]["description"]
        }">
            <figcaption>${weather[0]["description"]}</figcaption>
          </figure>
        `;
        li.innerHTML = markup;
        list.appendChild(li);
      })
      .catch(() => {
        msg.textContent = "Ingresa una ciudad valida! 😩";
      });
  
    msg.textContent = "";
    form.reset();
    input.focus();
  });



