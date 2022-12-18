'use strict';

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
  points = 0;
  update_score();
  shift_current_airport_to_left();
}

/* Gets random airport for the right side */
async function new_airport() {
  old = current;
  shift_current_airport_to_left();
  let response = await fetch('http://127.0.0.1:3000/airport/' + topic[0]);
  response = await response.json();
  current = response;
  right_one.innerHTML = response['country'];
  right_two.innerHTML = response['airport_name'];
  document.querySelector('.right').
      style.backgroundImage =
      `url("images/GamePictures/${response['iso_country']}.jpg")`;
  higher = response['topic_value'] >= old['topic_value'];
  place_pins();
}

/* Moves right airport to the left */
function shift_current_airport_to_left() {
  left_one.innerHTML = current['country'];
  left_two.innerHTML = current['airport_name'];
  left_three.innerHTML = current['topic_value'];
  document.querySelector('.left').style.backgroundImage =
      `url("images/GamePictures/${current['iso_country']}.jpg")`;
}

function higher_button_onClick() {
  if (higher) {
    right_answer();
  } else {
    wrong_answer();
  }
}

function lower_button_onClick() {
  if (!higher) {
    right_answer();
  } else {
    wrong_answer();
  }
}

function right_answer() {
  correct.play();
  points++;
  if (points >= topics[current_topic][3]) {
    topics[current_topic][3] = points;
    update_highscore();
  }
  update_score();
  check_unlocks();
  new_airport().then(() => {});
}

function update_score() {
  points_target.innerHTML = points.toString();
}

function update_highscore() {
  highscore_target.innerHTML = points.toString();
}

function update_topic() {
  document.querySelectorAll('.topic').forEach(e => e.innerHTML = topic[1]);
}

function wrong_answer() {
  fail.play();
  points_display.innerHTML = `Score: ${points}`;
  points_display.style.visibility = 'visible';
  end_game().then(() => new_game_popup());
}

async function end_game() {
  await fetch(
      `http://127.0.0.1:3000/game_end?points=${points}&name=${screen_name}&topic=${topic[2]}`);

}

function new_game_popup() {
  document.querySelector('dialog').showModal();
}

function Sound(src) {
  this.Sound = document.createElement('audio');
  this.Sound.src = src;
  this.Sound.volume = 0.1;
  this.Sound.setAttribute('preload', 'auto');
  this.Sound.setAttribute('controls', 'none');
  this.Sound.style.display = 'none';
  document.body.appendChild(this.Sound);
  this.play = function() {
    this.Sound.load();
    this.Sound.play().then();
  };
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
    unlock_criteria: 'Open the game',
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
    unlock_criteria: 'Open the game',
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
  }, {
    a1_bg_color: '#ffffff',
    a1_color: '#000000',
    a2_bg_color: '#000000',
    a2_color: '#ffffff',
    a3_bg_color: '#000000',
    a3_color: '#ffffff',
    a4_bg_color: 'rgba(0,0,0,0.67)',
    a4_color: '#ffffff',
    a_hover_bg: '#ffffff',
    a_hover_color: '#ff0000',
    unlock_criteria: 'Score 5 points on \'Elevation from sea level\'',
  }, {
    a1_bg_color: '#000000',
    a1_color: '#ffffff',
    a2_bg_color: '#ffffff',
    a2_color: '#000000',
    a3_bg_color: '#ffffff',
    a3_color: '#000000',
    a4_bg_color: 'rgba(255,255,255,0.67)',
    a4_color: '#000000',
    a_hover_bg: '#000000',
    a_hover_color: '#ff0000',
    unlock_criteria: 'Score 10 points on \'Elevation from sea level\'',
  }, {
    a1_bg_color: '#5bc7ef',
    a1_color: '#ffffff',
    a2_bg_color: '#eca4b2',
    a2_color: '#ffffff',
    a3_bg_color: '#f7f7f7',
    a3_color: '#000000',
    a4_bg_color: 'rgba(236,164,178,0.67)',
    a4_color: '#ffffff',
    a_hover_bg: '#5bc7ef',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Score 5 points on \'Flights\'',
  }, {
    a1_bg_color: '#2b79f5',
    a1_color: '#ffffff',
    a2_bg_color: '#5196ff',
    a2_color: '#ffffff',
    a3_bg_color: '#2b79f5',
    a3_color: '#000000',
    a4_bg_color: 'rgba(43,121,245,0.67)',
    a4_color: '#ffffff',
    a_hover_bg: '#033f9f',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Score 5 points on \'Average Google star rating\'',
  }, {
    a1_bg_color: '#555e73',
    a1_color: '#ffffff',
    a2_bg_color: '#9daed8',
    a2_color: '#ffffff',
    a3_bg_color: '#9daed6',
    a3_color: '#000000',
    a4_bg_color: 'rgba(221,198,190,0.67)',
    a4_color: '#ffffff',
    a_hover_bg: '#c6cad2',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Score 5 points on \'Review Amount\'',
  }, {
    a1_bg_color: '#ff0000',
    a1_color: '#ffffff',
    a2_bg_color: '#ffd400',
    a2_color: '#ffffff',
    a3_bg_color: '#0fb90a',
    a3_color: '#000000',
    a4_bg_color: 'rgba(46,108,255,0.67)',
    a4_color: '#ffffff',
    a_hover_bg: '#2e6cff',
    a_hover_color: '#ffffff',
    unlock_criteria: 'Score 5 points on \'Annual revenue\'',
  },
];

/* Theme unlocks */
document.querySelector('#secret').addEventListener('click', function() {
  unlockTheme(2);
});

function check_unlocks() {
  // Elevation
  if (topics[1][3] === 5) {
    unlockTheme(3);
  }
  if (topics[1][3] === 10) {
    unlockTheme(4);
  }

  // Flights
  if (topics[2][3] === 5) {
    unlockTheme(5);
  }

  // Star rating
  if (topics[3][3] === 5) {
    unlockTheme(6);
  }

  // Rating amount
  if (topics[4][3] === 5) {
    unlockTheme(7);
  }

  // Annual revenue
  if (topics[5][3] === 5) {
    unlockTheme(8);
  }
}

/* Elements and variables globally declared for convenience */
const topics = {
  1: ['elevation_ft', 'Elevation from sea level', '1', 0],
  2: ['flights', 'Daily flights', '2', 0],
  3: ['rating', 'Average Google star rating', '3', 0],
  4: ['review_amount', 'Amount of reviews on Google', '4', 0],
  5: ['revenue', 'Annual revenue', '5', 0],
};
let current_topic = 1;
let topic = topics[current_topic];
let higher;
let current;
let old;
let screen_name = 'Jeff';
let points = 0;
const left_one = document.querySelector('#left-one');
const left_two = document.querySelector('#left-two');
const left_three = document.querySelector('#left-three');
const right_one = document.querySelector('#right-one');
const right_two = document.querySelector('#right-two');
const higher_button = document.querySelector('#higher_btn');
const lower_button = document.querySelector('#lower_btn');
const points_target = document.querySelector('#points');
const highscore_target = document.querySelector('#highscore');
const points_display = document.querySelector('#points_display');

higher_button.addEventListener('click', higher_button_onClick);
lower_button.addEventListener('click', lower_button_onClick);
const correct = new Sound('effects/correct.mp3');
const fail = new Sound('effects/fail.mp3');

/* audio event */
const musicContainer = document.querySelector('.music-container');
const playbtn = document.querySelector('#play');
const audio = document.querySelector('#audio');

function playSong() {
  musicContainer.classList.add('play');
  playbtn.querySelector('i.fas').classList.remove('fa-volume-mute');
  playbtn.querySelector('i.fas').classList.add('fa-volume-up');
  audio.volume = 0.1;
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playbtn.querySelector('i.fas').classList.add('fa-volume-mute');
  playbtn.querySelector('i.fas').classList.remove('fa-volume-up');
  audio.pause();
}

playbtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

/* Topic selector */
document.querySelector('#topic_1').addEventListener('click', function() {
  current_topic = 1;
  topic = topics[current_topic];
  update_topic();
});
document.querySelector('#topic_2').addEventListener('click', function() {
  current_topic = 2;
  topic = topics[current_topic];
  update_topic();
});
document.querySelector('#topic_3').addEventListener('click', function() {
  current_topic = 3;
  topic = topics[current_topic];
  update_topic();
});
document.querySelector('#topic_4').addEventListener('click', function() {
  current_topic = 4;
  topic = topics[current_topic];
  update_topic();
});
document.querySelector('#topic_5').addEventListener('click', function() {
  current_topic = 5;
  topic = topics[current_topic];
  update_topic();
});
document.querySelector('#start_game').addEventListener('click', () => {
  if (document.querySelector('#screen_name').value !== '') {
    document.querySelector('dialog').close();
    screen_name = document.querySelector('#screen_name').value;
    display_leaderboard().then();
    init_left_side().then(() => new_airport());
  }
}, {passive: true});
document.querySelector('#new_game').addEventListener('click', new_game_popup);

/* map stuff */
let map = L.map('map');
map.setView([57.5, 20], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 15,
  minZoom: 4,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function place_pins() {
  const lat1 = current['latitude_deg'];
  const lat2 = old['latitude_deg'];
  const lng1 = current['longitude_deg'];
  const lng2 = old['longitude_deg'];
  const airp1 = current['airport_name'];
  const airp2 = old['airport_name'];
  const c1 = current['country'];
  const c2 = old['country'];
  L.marker([lat1, lng1]).
      bindPopup(`<b>${c1}</b><br>${airp1}`).
      openPopup().
      addTo(map);
  L.marker([lat2, lng2]).
      bindPopup(`<b>${c2}</b><br>${airp2}`).
      openPopup().
      addTo(map);
}

async function display_leaderboard() {
  const target = document.querySelector('#leaderboard');
  target.innerHTML = '';
  const title = document.createElement('p');
  title.setAttribute('class', 'topic accent_1');
  title.setAttribute('id', 'leaderboard_topic');
  target.appendChild(title);
  update_topic();
  const entry = document.createElement('div');
  const score = document.createElement('p');
  const name = document.createElement('p');
  entry.setAttribute('class', 'leaderboard_entry accent_2');
  score.appendChild(document.createTextNode('Score'));
  name.appendChild(document.createTextNode('Name'));
  entry.appendChild(score);
  entry.appendChild(name);
  target.appendChild(entry);
  let response = await fetch('http://127.0.0.1:3000/leaderboard/' + topic[2]);
  response = await response.json();
  response.forEach(e => {
    const entry = document.createElement('div');
    const score = document.createElement('p');
    const name = document.createElement('p');
    entry.setAttribute('class', 'leaderboard_entry accent_2');
    score.appendChild(document.createTextNode(e[0]));
    name.appendChild(document.createTextNode(e[1]));
    entry.appendChild(score);
    entry.appendChild(name);
    target.appendChild(entry);
  });
}

removeNotifications();
themeButtons(); // Create theme buttons
unlockTheme(0); // Unlock default themes
unlockTheme(1); // Unlock default themes
changeThemeTo(0); // Set theme to [0]
update_score();
update_highscore();
update_topic();
new_game_popup();

/* DEBUGGING/CHEAT: */
document.querySelector('h1').addEventListener('click', function() {
  unlockTheme(3);
  unlockTheme(4);
  unlockTheme(5);
  unlockTheme(6);
  unlockTheme(7);
  unlockTheme(8);
});
