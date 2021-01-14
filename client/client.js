//Front End Server to listen to data from forms
console.log('Hello World!'); //Test
const form = document.querySelector('form'); //get refernce to the forms
const loadingElement=document.querySelector('.loading'); //reference to loading animation
const tweetsElement = document.querySelector('.tweets'); 
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/tweets': 'https://tweeterapp.adhamoudeif.vercel.app/tweets'; //location of server that request is made to
loadingElement.style.display = ''; //show loading animation when page loads

listAllTweets();
tweetsElement.innerHTML = ''; 
//listen to when user clicks submit
form.addEventListener('submit', (event) => {
    event.preventDefault();
    //grab data from page using references to name and content
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const tweet = {
        name,
        content
    };
    

    //hide form after submitting
    form.style.display='none';
    loadingElement.style.display = '';

    //Test - console.log('form was submitted');

    //specify and send request to backend server
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(tweet), //parse
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdTweet => {
        //show form after submitting
        form.reset();
        setTimeout(() => {
        form.style.display = '';
        }, 5000);
        listAllTweets(); 
      });
});

//function to log out all tweets onto page
function listAllTweets() {
    fetch(API_URL)
      .then(response => response.json())
      .then(tweets => {
          console.log(tweets);
          //display tweets by iterating over array, also reverse order to show most recent
          tweets.reverse();
          tweets.forEach(tweet => {
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent = tweet.name;

            const contents = document.createElement('p');
            contents.textContent = tweet.content;

            const date = document.createElement('small');
            date.textContent = new Date(tweet.created);

            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);


            tweetsElement.appendChild(div);
          });
          loadingElement.style.display = 'none';
      });
}