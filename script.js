function increaseNotifications() {
  notifications++;
  for (let notification_indicator of notification_indicators) {
    notification_indicator.innerHTML = notifications;
    notification_indicator.style.display = 'flex';
  }
}

function decreaseNotifications() {
  notifications--;
  for (let notification_indicator of notification_indicators) {
    notification_indicator.innerHTML = notifications;
    if (notifications < 1) {
      notification_indicator.style.display = 'none';
      notifications = 0;
    } else {
      notification_indicator.style.display = 'flex';
    }
  }
}

function removeNotifications() {
  notifications = 0;
  for (let notification_indicator of notification_indicators) {
    notification_indicator.innerHTML = notifications;
    notification_indicator.style.display = 'none';
  }
}

/* Changes colors of the elements and removes the notification */
function changeThemeTo(theme_index) {
  /* EXAMPLE OF INPUT DICT STRUCTURE:
  {
    a1_bg_color: '#000000',
    a1_color: '#ffffff',
    a2_bg_color: '#343434',
    a2_color: '#ffffff',
    a3_bg_color: '#1a1a1a',
    a3_color: '#ffffff',
    a4_bg_color: '#2b79f5AA',
    a4_color: '#ffffff',
    a_hover_bg: '#2b79f5',
    a_hover_color: '#000000'
  } */
  const accent_1 = document.querySelectorAll('.accent_1');
  accent_1.forEach((element) => {
    element.style.backgroundColor = color_schemes[theme_index]['a1_bg_color'];
    element.style.color = color_schemes[theme_index]['a1_color'];
  });
  const accent_2 = document.querySelectorAll('.accent_2');
  accent_2.forEach((element) => {
    element.style.backgroundColor = color_schemes[theme_index]['a2_bg_color'];
    element.style.color = color_schemes[theme_index]['a2_color'];
  });
  const accent_3 = document.querySelectorAll('.accent_3');
  accent_3.forEach((element) => {
    element.style.backgroundColor = color_schemes[theme_index]['a3_bg_color'];
    element.style.color = color_schemes[theme_index]['a3_color'];
  });
  const accent_4 = document.querySelectorAll('.accent_4');
  accent_4.forEach((element) => {
    element.style.backgroundColor = color_schemes[theme_index]['a4_bg_color'];
    element.style.color = color_schemes[theme_index]['a4_color'];
  });
  const accent_hover = document.querySelectorAll('.accent_hover');
  accent_hover.forEach((element) => {
    element.style.setProperty('--a_hover_bg',
        color_schemes[theme_index]['a_hover_bg']);
    element.style.color = color_schemes[theme_index]['a_hover_color'];
  });
  const all_themes = document.querySelectorAll('.theme_item');
  if (all_themes[theme_index].getAttribute('data-unlocked') === 'true' &&
      all_themes[theme_index].children[0].children.length > 4) {
    all_themes[theme_index].children[0].children[0].remove();
    decreaseNotifications();
  }

}

/* Creates theme buttons */
function themeButtons() {
  /* structure:
    <article>
        <figure class="theme-buttons">
            <span class="lock_img"><img></span>
            <span class="color"></span>
            <span class="color"></span>
            <span class="color"></span>
            <span class="color"></span>
        </figure>
        <p class="unlock_criteria"></p>
    </article> */

  /* Create elements */
  const section = document.querySelector('#themes');
  for (let [i, item] of color_schemes.entries()) {
    const article = document.createElement('article');
    article.setAttribute('data-unlocked', 'false');
    article.setAttribute('class', 'theme_item');
    section.appendChild(article);

    const figure = document.createElement('figure');
    figure.setAttribute('class', 'theme-buttons');
    article.appendChild(figure);

    const span = document.createElement('span');
    span.setAttribute('class', 'lock_img');
    const img = document.createElement('img');
    img.setAttribute('src', 'images/lock.svg');
    img.setAttribute('alt', 'locked');
    img.setAttribute('width', '25');
    img.setAttribute('height', '25');
    span.appendChild(img);
    figure.appendChild(span);

    for (let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.setAttribute('class', 'color');
      figure.appendChild(span);
    }
    const p = document.createElement('p');
    p.innerHTML = item.unlock_criteria;
    p.setAttribute('class', 'unlock_criteria');
    article.appendChild(p);
    /* Theme change event listener */
    article.addEventListener('click', function() {
      if (article.getAttribute('data-unlocked') === 'true') {
        changeThemeTo(i);
      }
    });
    document.querySelector('.themes').appendChild(article);
  }

  /* Style elements */
  const buttons = document.querySelectorAll('.theme-buttons');
  for (let [b_index, button] of buttons.entries()) {
    let main_colors = [
      color_schemes[b_index]['a1_bg_color'],
      color_schemes[b_index]['a2_bg_color'],
      color_schemes[b_index]['a3_bg_color'],
      color_schemes[b_index]['a_hover_bg']];
    let elements = Array.from(button.children);
    elements.shift();
    for (let [s_index, span] of elements.entries()) {
      span.style.backgroundColor = main_colors[s_index];
    }
  }
}

/* Unlocks a theme and adds a notification */
function unlockTheme(theme_index) {
  const all_themes = document.querySelectorAll('.theme_item');
  all_themes[theme_index].setAttribute('data-unlocked', 'true');
  const span = all_themes[theme_index].children[0].children[0];
  span.children[0].remove();
  span.style.backgroundColor = '#fe0b15';
  span.style.outline = '#ffffff solid 0';
  increaseNotifications();
}

/* Gets random airport for the left side */
async function init_left_side() {
  let response = await fetch('http://127.0.0.1:3000/airport/' + topic[0]);
  response = await response.json();
  current = response;
  shift_current_airport_to_left();
}

/* Gets random airport for the right side */
async function new_airport() {
  shift_current_airport_to_left();

  async function get_new() {
    let response = await fetch('http://127.0.0.1:3000/airport/' + topic[0]);
    response = await response.json();
    if (response['airport_name'] === left_two.textContent) {
      await get_new();
    } else return response;
  }

  let response = await get_new();
  current = response;
  right_one.innerHTML = response['country'];
  right_two.innerHTML = response['airport_name'];
  higher = response['topic_value'] >= left_three.textContent;
}

/* Moves right airport to the left */
function shift_current_airport_to_left() {
  left_one.innerHTML = current['country'];
  left_two.innerHTML = current['airport_name'];
  left_three.innerHTML = current['topic_value'];
}


/* higher variable can be used to determine what do with buttons
* higher is either true of false
* if higher is true, it means the airport on the right is higher */
function right_answer() {
  /* TODO */
}

function wrong_answer() {
  /* TODO */
}

async function end_game() {
  /* TODO */
  `http://127.0.0.1:3000/game_end?points=${points}&name=${screen_name}&topic=${topic[2]}`;
}

/* Notification count */
const notification_indicators = document.querySelectorAll('.notification');
let notifications = 0;

/* All color schemes (dictionaries in a list) */
const color_schemes = [
  {
    a1_bg_color: '#000000',
    a1_color: '#ffffff',
    a2_bg_color: '#343434',
    a2_color: '#ffffff',
    a3_bg_color: '#1a1a1a',
    a3_color: '#ffffff',
    a4_bg_color: '#2b79f5AA',
    a4_color: '#ffffff',
    a_hover_bg: '#2b79f5',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Start the game',
  }, {
    a1_bg_color: '#ffffff',
    a1_color: '#000000',
    a2_bg_color: '#f8f8f8',
    a2_color: '#000000',
    a3_bg_color: '#fafafa',
    a3_color: '#000000',
    a4_bg_color: '#ea0000aa',
    a4_color: '#ffffff',
    a_hover_bg: '#ea0000',
    a_hover_color: '#000000',
    unlock_criteria: 'Start the game',
  }, {
    a1_bg_color: '#ff006e',
    a1_color: '#ffffff',
    a2_bg_color: '#8c0f7c',
    a2_color: '#ffffff',
    a3_bg_color: '#7f006e',
    a3_color: '#ffffff',
    a4_bg_color: '#7f006eAA',
    a4_color: '#ffffff',
    a_hover_bg: '#ff006e',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Find the secret div',
  }];

/* Secret theme unlock */
document.querySelector('#secret').addEventListener('click', function() {
  unlockTheme(2);
});

/* Elements and variables globally declared for convenience */
const topics = {
  1: ['elevation_ft', 'Elevation from sea level', '1'],
  2: ['flights', 'Daily flights', '2'],
  3: ['rating', 'Average Google star rating', '3'],
  4: ['review_amount', 'Amount of reviews on Google', '4'],
  5: ['revenue', 'Annual revenue', '5'],
};
let topic = topics[1];
console.log(topic[2]);
let higher;
let current;
let screen_name;
let points;
const left_one = document.querySelector('#left-one');
const left_two = document.querySelector('#left-two');
const left_three = document.querySelector('#left-three');
const right_one = document.querySelector('#right-one');
const right_two = document.querySelector('#right-two');
/*
const higher_button = document.querySelector('#higher_btn');
const lower_button = document.querySelector('#lower_btn_btn');
*/

/* map stuff */
let latitude1 = 60.192059;
let longitude1 = 24.945831;
let latitude2 = 34.052235;
let longitude2 = -118.243683;
let country1 = 'finlander';
let country2 = 'ameriga';
let airport1 = 'helsinki airpot';
let airport2 = 'losangeles mega airport';

let map = L.map('map');
map.setView([0, 0], 2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
L.marker([latitude1, longitude1]).
    bindPopup(`<b>${country1}</b><br>${airport1}`).
    openPopup().
    addTo(map);
L.marker([latitude2, longitude2]).
    bindPopup(`<b>${country2}</b><br>${airport2}`).
    openPopup().
    addTo(map);

removeNotifications();
themeButtons(); // Create theme buttons
unlockTheme(0); // Unlock default themes
unlockTheme(1); // Unlock default themes
changeThemeTo(0); // Set theme to [0]
init_left_side().then(() => new_airport());