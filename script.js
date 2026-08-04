const gifStages = [
  "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
  "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
  "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
  "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
  "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
  "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
  "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
]

const noMessages = [
  "No",
  "Are you positive? 🤔",
  "Pookie please... 🥺",
  "But I already planned everything...",
  "I'll be really sad 😢",
  "Don't do this to me...",
  "Last chance 😭",
  "PLEASE??? 💔",
  "You can't catch me anyway 😜"
]

const subtitles = [
  "C'mon... 🥺",
  "Really?? 😟",
  "It'll be so fun... 😢",
  "Please just say yes 💔",
  "I'm begging you 😭",
  "LAST CHANCE!! 😤"
]

const teasePokes = [
  "Try saying no first... just once 😏",
  "Go on, hit no... I dare you 👀",
  "You're missing out 😈",
  "Click no, I bet you won't 😏"
]

// Default date shown on Page 2 / success page (editable by the user on Page 2)
const DEFAULT_DATE_TEXT = "Saturday, 08th Aug 2026"

let noClickCount = 0, yesTeasedCount = 0, runawayEnabled = false, musicPlaying = true
let chosenDateText = DEFAULT_DATE_TEXT
let chosenActivity = null

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn  = document.getElementById('no-btn')
const music  = document.getElementById('bg-music')

// Floating hearts
const heartEmojis = ['💕','💗','💖','💝','💓','🌸','✨','💘']
const heartsBg = document.getElementById('hearts-bg')
for (let i = 0; i < 14; i++) {
  const h = document.createElement('span')
  h.className = 'heart-particle'
  h.textContent = heartEmojis[i % heartEmojis.length]
  h.style.left = (Math.random() * 92 + 4) + '%'
  h.style.animationDuration = (3 + Math.random() * 4) + 's'
  h.style.animationDelay = (Math.random() * 5) + 's'
  h.style.fontSize = (0.8 + Math.random() * 0.9) + 'rem'
  heartsBg.appendChild(h)
}

// Music autoplay
music.muted = true
music.volume = 0.3
music.play().then(() => { music.muted = false }).catch(() => {
  document.addEventListener('click', () => {
    music.muted = false
    music.play().catch(() => {})
  }, { once: true })
})

function toggleMusic() {
  if (musicPlaying) {
    music.pause()
    musicPlaying = false
    document.getElementById('music-toggle').textContent = '🔇'
  } else {
    music.muted = false
    music.play()
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
  }
}

function showToast(msg) {
  const t = document.getElementById('tease-toast')
  t.textContent = msg
  t.classList.add('show')
  clearTimeout(t._timer)
  t._timer = setTimeout(() => t.classList.remove('show'), 2800)
}

// ---------- PAGE 1: Yes/No (unchanged behavior) ----------

function handleYes() {
  if (!runawayEnabled) {
    showToast(teasePokes[Math.min(yesTeasedCount, teasePokes.length - 1)])
    yesTeasedCount++
    return
  }

  confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#ff69b4','#ff1493','#ffb3c1','#fff','#ff85a2','#d63384','#ffdf00'] })
  setTimeout(() => {
    confetti({ particleCount: 60, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 } })
    confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } })
  }, 300)

  setTimeout(() => {
    document.getElementById('main-page').style.display = 'none'
    document.getElementById('date-page').style.display = 'block'
  }, 700)
}

function handleNo() {
  noClickCount++
  noBtn.textContent = noMessages[Math.min(noClickCount, noMessages.length - 1)]

  const ySize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
  yesBtn.style.fontSize = (ySize * 1.3) + 'px'
  yesBtn.style.padding = `${Math.min(16 + noClickCount * 2, 30)}px ${Math.min(44 + noClickCount * 4, 70)}px`

  if (noClickCount >= 2) {
    const nSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
    noBtn.style.fontSize = Math.max(nSize * 0.86, 10) + 'px'
  }

  catGif.style.opacity = '0'
  setTimeout(() => {
    catGif.src = gifStages[Math.min(noClickCount, gifStages.length - 1)]
    catGif.style.opacity = '1'
  }, 200)

  document.getElementById('subtitle').textContent = subtitles[Math.min(noClickCount - 1, subtitles.length - 1)]

  if (noClickCount >= 8 && !runawayEnabled) {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
    runawayEnabled = true
  }
}

function runAway() {
  const m = 20
  noBtn.style.position = 'fixed'
  noBtn.style.left = (Math.random() * (window.innerWidth  - noBtn.offsetWidth  - m) + m / 2) + 'px'
  noBtn.style.top  = (Math.random() * (window.innerHeight - noBtn.offsetHeight - m) + m / 2) + 'px'
  noBtn.style.zIndex = '50'
}

// ---------- PAGE 2: The date ----------

function showDateEditor() {
  document.getElementById('date-editor').style.display = 'block'
  document.getElementById('edit-date-link').style.display = 'none'
}

function saveDate() {
  const input = document.getElementById('date-input')
  if (!input.value) return

  // Format the chosen date nicely, e.g. "Saturday, 08th Aug 2026"
  const d = new Date(input.value + 'T00:00:00')
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const month = d.toLocaleDateString('en-US', { month: 'short' })
  const day = d.getDate()
  const suffix = (day % 10 === 1 && day !== 11) ? 'st'
               : (day % 10 === 2 && day !== 12) ? 'nd'
               : (day % 10 === 3 && day !== 13) ? 'rd' : 'th'
  chosenDateText = `${weekday}, ${String(day).padStart(2, '0')}${suffix} ${month} ${d.getFullYear()}`

  document.getElementById('date-display').textContent = chosenDateText
  document.getElementById('date-editor').style.display = 'none'
  document.getElementById('edit-date-link').textContent = 'Change date again? ✏️'
  document.getElementById('edit-date-link').style.display = 'block'
}

function goToActivityPage() {
  document.getElementById('date-page').style.display = 'none'
  document.getElementById('activity-page').style.display = 'block'
}

// ---------- PAGE 3: Activity choice ----------

function selectOption(btn) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  chosenActivity = btn.dataset.option
  document.getElementById('activity-next-btn').disabled = false
}

function goToSuccessPage() {
  document.getElementById('activity-page').style.display = 'none'
  document.getElementById('success-page').style.display = 'block'

  // Update the final date badge with whatever date/activity was chosen
  const activityText = chosenActivity ? ` Let's do: ${chosenActivity} 🎈` : ''
  document.getElementById('final-date-badge').textContent =
    `💌 Reserve ${chosenDateText} I have something special planned just for you 🌹${activityText}`

  confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#ff69b4','#ff1493','#ffb3c1','#fff','#ff85a2','#d63384','#ffdf00'] })
  const end = Date.now() + 4000
  const b = setInterval(() => {
    if (Date.now() > end) { clearInterval(b); return }
    confetti({ particleCount: 30, angle: 60,  spread: 50, origin: { x: 0, y: 0.65 } })
    confetti({ particleCount: 30, angle: 120, spread: 50, origin: { x: 1, y: 0.65 } })
  }, 350)
}

// ---------- PAGE 4: Success page "Know more" reveal ----------

function revealSecretMessage() {
  const msg = document.getElementById('secret-message')
  const link = document.getElementById('know-more-link')
  msg.style.display = 'block'
  link.style.display = 'none'
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
