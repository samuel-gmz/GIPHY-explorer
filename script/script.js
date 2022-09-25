import { getObserver, getObserverSearch } from './observer.js'

const gifsBox = document.getElementById('images')

let offset = 0

// Lógica para Trending
const obtenerTrending = async () => {
  const respuesta = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=BImA4ZPw81pcgAbJsJ8ls8A78xp7yFm5&limit=20&offset=${offset}`)
  const { data } = await respuesta.json()
  offset += 20
  return data
}

export const mainFunction = async () => {
  const data = await obtenerTrending()
  const lastImg = data.pop() 
  const lastImgTemplate = createImg(lastImg) 

  // Acá se llama a la función del IntersectionObserver en observer.js
  getObserver(lastImgTemplate)

  const templates = data.map((img) => createImg(img)) 
  gifsBox.append(...templates) 
  gifsBox.append(lastImgTemplate)
}

const createImg = (element) => { 
  const img = document.createElement('img')
  img.src = element.images.original.webp
  img.alt = element.title

  return img
}

window.addEventListener('load', mainFunction) 

// Lógica para Search

let offset2 = 0

// El array que contendrá el texto de las búsquedas recientes
let recent = []

// Esta variable sirve para que cuando se llame a mainFunctionSearch desde observer.js pueda pasarle este valor
// que contiene el texto ingresado por input y así pueda ejecutarse sin necesidad de un nuevo click en submit 
export let currentSearch = ""

const formulario = document.querySelector('#form1')

const ul = document.getElementById('ul')

window.addEventListener('load', () => {
  formulario.addEventListener('submit', searchGifs)
})

const searchGifs = e => {
  e.preventDefault()

  // Resetea el offset2 con cada nuevo submit
  offset2 = 0

  cleanHTML()

	const search = document.querySelector('#search').value 

  if (recent.length > 2) {
    recent.shift()
    recent.push(search)
  } else {
    recent.push(search)
  }
    
  localStorage.recent = JSON.stringify(recent)

  // Limpio el contenido de ul para que se dibuje nuevamente y no se sume al anterior
  ul.innerHTML = "" 

  recent.forEach(element => { 
    makeListItem(element, ul)
  })

  // Le asigno el texto del input a la variable exportable
  currentSearch = search

  mainFunctionSearch(search)
}

const obtenerSearch = async (search) => { 
  const respuesta = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=BImA4ZPw81pcgAbJsJ8ls8A78xp7yFm5&q=${search}&limit=20&offset=${offset2}`)
  const { data } = await respuesta.json()
  offset2 += 20
  return data
}

export const mainFunctionSearch = async (search) => { 
  const data = await obtenerSearch(search) 
  const lastImg2 = data.pop() 
  const lastImgTemplate2 = createImg(lastImg2) 
  getObserverSearch(lastImgTemplate2)
  const templates = data.map((img) => createImg(img)) 
  gifsBox.append(...templates) 
  gifsBox.append(lastImgTemplate2) 
}

// Para armar los list items
const makeListItem = (text, parent) => { 
  let listItem = document.createElement('li')
  listItem.textContent = text
  parent.appendChild(listItem)
}

const cleanHTML = () => { 
	gifsBox.innerHTML = ""
}

// Intento de cargar desde el local storage la lista de busquedas recientes
let recentSearches
recentSearches = JSON.parse(localStorage.recent)
const loadFromLocal = () => {
  recentSearches.forEach(element => { 
  makeListItem(element, ul)
})}

window.addEventListener('load', loadFromLocal)