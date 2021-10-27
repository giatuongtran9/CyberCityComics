class Comic {
    constructor() {
    const url = "https://cybercity-comic.herokuapp.com/"
    // const url = "https://localhost:8000/"

    this.currentNum = 0;

    this.timeSpend = 0;
    this.oldtime = 0

    this.registerEvents()

    this.loadCurrent()

    this.startTime()
    }

    setMaxNum(number) {
        this.maxNum = number
    }

    setCurrentNum(number) {
        this.currentNum = number
    }
    
    // previous amount of time when fetching from /updateTime
    // NOT WORK
    setOldTime(time) {
        this.oldtime = time
    }

    // total amount of time view page
    // NOT WORK
    totalTime() {
        return this.timeSpend + this.oldtime
    }



    // display all the content of the comic
    display(data) {
        const container = document.getElementById("container")
        const contentDiv1 = document.getElementById("content1")
        const contentDiv2 = document.getElementById("content2")
    
        const book = {
            num: data.num,
            title: data.title,
            safe_title: data.safe_title,
            transcript: data.transcript,
            year: data.year,
            month: data.month,
            day: data.day,
            img: data.img,
            alt: data.alt,
            link: data.link,
            news: data.news,
        }
    
        const titleDiv = document.getElementById("title")
        titleDiv.innerHTML = book.title
    
        const imageDiv = document.getElementById("image")
        imageDiv.src = book.img
        imageDiv.alt = book.alt
        imageDiv.title = book.alt
    
        const transcriptDiv = document.getElementById("transcript")
        var styleTrans = book.transcript.replace(/[\[\]']+/g, "")
        
        if (book.transcript !== "") {
            transcriptDiv.innerText = styleTrans
        } else {
            transcriptDiv.innerHTML = "No Transcript available"
        }
    
        const createdAtDiv = document.getElementById("createdAt")
        createdAtDiv.innerHTML = "Created On " + book.month + "/" + book.day + "/" + book.year

    }

    // get the max number
    loadCurrent() {
        const requestUrl = '/getData'
        fetch(requestUrl)
        .then(res => {
            return res.json()
        })
        .then(data => {
            this.setMaxNum(data.num)
        })
    }

    //GET COMIC BY NUMBER
    //USING FETCH
    getComicByNum(num) {
        const requestUrl = '/getData'
        fetch(`${requestUrl}/${num}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            this.display(data)
            this.setCurrentNum(data.num)
        })
    }

    getCurrentComic() {
        const requestUrl = '/getData'
        fetch(requestUrl)
        .then(res => {
            return res.json()
        })
        .then(data => {
            this.display(data)
            this.setCurrentNum(data.num)
            this.setMaxNum(data.num)
        })

    }

    // FUNCTION FOR PREVIOUS BUTTON
    prev() {
        const prevNum = this.currentNum - 1
        if (prevNum < 1) {
            return;
        }

        this.getComicByNum(prevNum)

        window.location = `/${prevNum}`
    }

    // FUNCTION FOR NEXT BUTTON
    next() {
        const nextNum = this.currentNum + 1
        if (nextNum > this.maxNum) {
            return;
        }
        this.getComicByNum(nextNum)

        window.location = `/${nextNum}`
    }

    // FUNCTION FOR RANDOM BUTTON
    random() {
        const min = 1;
        const max = this.maxNum;
        const randomNum = Math.floor(Math.random() * max);
        
        this.getComicByNum(randomNum)

        window.location = `/${randomNum}`
    }
    
    //REGISTER EVENT WHEN FIRST INITIALIZE
    registerEvents() {
        document.getElementById("prev").addEventListener('click', () => {
            this.prev()
        })

        document.getElementById("next").addEventListener('click', () => {
            this.next()
        })

        document.getElementById("random").addEventListener('click', () => {
            this.random()
        })
    }

    //START TO COUNT TIME WHEN FIRST INITIALIZE
    startTime() {
        var timeSpendInterval = setInterval(() => {
            this.timeSpend++;
            document.getElementById("timeSpend").innerHTML = this.totalTime()
       
        }, 1000)
    }

    
}

// INITIALIZE NEW OBJECT
const comic = new Comic();

// GET THE CURRENT NUMBER IN URL, CAN MODIFY THE NUMBER IN THE URL TO LINK TO THAT COMIC
let currentNum = window.location.pathname.toString().replace("/", "")
console.log(currentNum)

if (currentNum !== "") {
    comic.getComicByNum(currentNum)
} else {
    comic.getCurrentComic()
}



// Count the total amount of time spend on a page
// FAIL because "oldtime" still get the previous value when load or click previous, next, random button
//***NEED TO FIND A WAY TO UPDATE oldtime WHEN LOAD */
// window.addEventListener("load", () => {
//     fetch('/updateTime')
//     .then(res => {
//         return res.json()
//     })
//     .then(data => {
//         var currentMax = Object.keys(data.timeSpend)[0]

//         console.log(data.timeSpend)
//         console.log(currentNum)
//         comic.setOldTime(data.timeSpend[comic.currentNum] == undefined ? data.timeSpend[currentMax] : data.timeSpend[currentNum])
//     })
// })

// window.addEventListener("visibilitychange", () => {
//     navigator.sendBeacon('/updateTime', JSON.stringify({
//         num: comic.currentNum,
//         timespend: comic.timeSpend
//     }))
// })
