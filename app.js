let form = document.querySelector('form')
let genButton = document.querySelector('#gen')
let wordGen = document.querySelector('.randomWord')
let hints = document.querySelector('.hints')

// let words = [];
// const bank = fetch('./words.txt').then(e=> e.text())
//     .then(data=>{ words = data.toLowerCase().split('\n');})


const wordContains = (word, letters) => {
  for (let l of letters) if (!word.includes(l)) return false
  return true
}

const wordNotContains = (word, letters) => {
  for (let l of letters) if (word.includes(l)) return false
  return true
}

const qCheck = (a, b, valid = true) => {
  if (a != '' && b != '') valid = a == b
  return valid
}

const wordContainsPos = (arr, f = '', s = '', t = '', r = '', v = '') => {
  return arr.filter(
    w =>
      qCheck(w[0], f) &&
      qCheck(w[1], s) &&
      qCheck(w[2], t) &&
      qCheck(w[3], r) &&
      qCheck(w[4], v)
  )
}

const wordNotContainsPos = (arr, f = '', s = '', t = '', r = '', v = '') => {
  return arr.filter(
    w =>
      !qCheck(w[0], f, false) &&
      !qCheck(w[1], s, false) &&
      !qCheck(w[2], t, false) &&
      !qCheck(w[3], r, false) &&
      !qCheck(w[4], v, false)
  )
}

const filterContains = (arr, letters) => {
  return arr.filter(w => wordContains(w, letters))
}
const filterNotContains = (arr, letters) => {
  return arr.filter(w => wordNotContains(w, letters))
}
const thru = (arr, inp, funcName) => {
  return funcName(arr, inp[0], inp[1], inp[2], inp[3], inp[4])
}

const genEvent = () => {
  wordGen.classList.remove('anim')
  wordGen.offsetWidth
  wordGen.innerText = words[Math.floor(Math.random() * words.length)]
  wordGen.classList.add('anim')
}

const resetHints = () => {
  while (hints.hasChildNodes()) hints.removeChild(hints.firstChild)
  hints.style.display = 'none'
  hints.setAttribute("wordCount","");
}

const popHints = h => {
  hints.style.display = 'flex'
  if (h == undefined || h == null || h.length <= 0) {
    hints.setAttribute("wordCount",'no results found!');
  } else {
    for (let w of h) {
      hints.setAttribute("wordCount",h.length); 
      let sp = document.createElement('span')
      sp.innerText = w
      hints.append(sp)
    }
  }
}

const posLetterFunc = (sample, posCont, fn) => {
  posCont = Array.from(posCont.querySelectorAll('input')).map(e =>
    e.value.toLowerCase()
  )
  return thru(sample, posCont, fn)
}

const processStuff = (e = undefined) => {
  e != undefined && e.preventDefault()
  resetHints()
  let sample = [...words]
  let validLetters = form.validL.value.toLowerCase()
  let invalidLetters = form.invalidL.value.toLowerCase()
  let validPos = form.querySelector('.validPos')
  let wrongSpot = form.querySelector('.wrongSpotCont')
  sample = filterContains(sample, validLetters)
  sample = filterNotContains(sample, invalidLetters)
  sample = posLetterFunc(sample, validPos, wordContainsPos)

  if (wrongSpot.childElementCount > 0) {
    for (let inV of wrongSpot.querySelectorAll('.cards'))
      sample = posLetterFunc(sample, inV, wordNotContainsPos)
  } else {
    wrongSpot.style.display = 'none'
  }

  sample.length < 5000 && popHints(sample)
}

const getClose = () => {
  let close = document.createElement('button')
  close.classList.add('close', 'hidden')
  close.innerHTML = '&#8722;'
  close.title = 'remove'
  close.addEventListener('click', () => {
    let b = close.parentElement.parentElement
    b.parentElement.removeChild(b)
    processStuff()
  })
  return close
}

const getCard = () => {
  let crd = document.createElement('div')
  crd.classList.add('cards')
  return crd
}

const createValid = () => {
  let crd = getCard()
  let cls = getClose()
  for (let i = 1; i <= 5; i++) {
    let inp = document.createElement('input')
    inp.setAttribute('type', 'text')
    inp.placeholder = i
    inp.maxlength = 1
    if (i === 1) {
      let e = document.createElement('section')
      e.append(inp,cls)
      inp = e
    }
    crd.append(inp)
  }

  crd.addEventListener('mouseover', () => {
    cls.classList.remove('hidden')
  })
  crd.addEventListener('mouseout', () => {
    cls.classList.add('hidden')
  })
  crd.classList.add('validL')
  return crd
}

genButton.addEventListener('click', genEvent)
form.addEventListener('change', processStuff)

form.addEventListener('click', e => {
  e.preventDefault()
  let wrongSpot = form.querySelector('.wrongSpotCont')
  if (e.target.name === 'add' && wrongSpot.childElementCount < 3) {
    wrongSpot.append(createValid())
    wrongSpot.style.display = 'flex'
  }
})
