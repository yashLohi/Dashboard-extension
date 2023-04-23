//GET USER NAME & USE IN TO DO LIST AND GREETING
const userBtn = document.getElementById('user-btn')
const userInput = document.getElementById('user-input')
const userName = JSON.parse(localStorage.getItem('userInfo'))

userBtn.addEventListener('click', userBtnClick )

function userBtnClick(e){
    e.preventDefault()
    window.localStorage.setItem("userInfo", JSON.stringify(userInput.value) || '')
    window.location.reload();
}


//FETCH THE PICTURE TO USE AS BACKGROUND
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
		document.getElementById("author").textContent = `Photo by: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
		document.getElementById("author").textContent = `By: Dodi Achmad`
    })

//FETCH DAILY QUOTE TO DISPLAY
fetch('https://type.fit/api/quotes')
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
    return res.json()
    })
    .then(data => {
        const quoteArray = data
        const randomNumber = Math.floor(Math.random() * quoteArray.length)
        const randomQuote = quoteArray[randomNumber]
        document.getElementById("quote").innerHTML = `
                <div class="quote-box">
                    <h3>${randomQuote.text}</h3>
                    <h5>${randomQuote.author}</h5>
                </div>
            `
    })
    .catch(err => console.error(err))

//FETCH THE CURRENT TIME AND DATE TO DISPLAY
function getCurrentTime() {
    const date = new Date()
    const hour = date.getHours()
    const actualDate = date.toLocaleDateString("en-GB");
    const actualTime = date.toLocaleTimeString("en-us", {timeStyle: "short"})
    const timeOfDay = hour >=0 && hour <12 ? "Good Morning" 
        : hour >=12 && hour <18 ? "Good Afternoon"
        : "Good Evening"
    document.getElementById("time").innerHTML = `
        <h1 class="time">${actualTime} <span>on the</span> ${actualDate}</h1>
        <h2 class="expression">${timeOfDay} ${userName}</h2>
    `
}

setInterval(getCurrentTime, 1000)

//FETCH CURRENT TEMPERATURE AND CITY TO DISPLAY
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

//TO DO LIST SECTION
const myInput = document.getElementById("my-input")
const listBtn = document.getElementById("list-btn")
const listItems = document.getElementById("list-items")
const deleteBtn = document.querySelector('.done-btn')
const userToDoList = document.getElementById('user-to-do-list')

userToDoList.innerText = `${userName}'s To Do List`

let myList = []

listBtn.addEventListener('click', addListItems)
deleteBtn.addEventListener('click', deleteListItems)

function saveToLocal(){
    localStorage.setItem("myList", JSON.stringify(myList))
    renderHtml()
}

//ADD TO LIST ARRAY
function addListItems(e){
    e.preventDefault()

    if (myInput.value.length >= 1){
        myList.push({name: myInput.value, 
            id:(new Date()).getTime(),
            isDone: false})
    } else {
        alert('Please enter in a task to do')
    }
        
    myInput.value=''
    saveToLocal()
}

// DELETE ITEM FROM LIST
function deleteListItems(e){
    console.log(myList)
    myList.map(item => {
       if (item.id == e.target.id){
           const indexOfItem = myList.indexOf(item)
           myList.splice(indexOfItem, 1)
       }
    })
    saveToLocal()
   }
   

//CREATE HTML ELEMENTS TO RENDER TO THE PAGE
function renderHtml(){
    let html=""
    myList =  JSON.parse(localStorage.getItem('myList'))
    myList.map(item => {
        html += `
                    <div class="list-item" data-key=${item.id}>
                        <li>${item.name}</li>
                        <button class="done-btn" id=${item.id}>Delete</button>
                    </div>
                `
        })
    listItems.innerHTML = html

}
renderHtml()




