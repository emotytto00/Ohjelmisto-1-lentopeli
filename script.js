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

removeNotifications();
themeButtons(); // Create theme buttons
unlockTheme(0); // Unlock default themes
unlockTheme(1); // Unlock default themes
changeThemeTo(0); // Set theme to [0]