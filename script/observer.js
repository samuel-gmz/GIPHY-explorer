import { mainFunction, mainFunctionSearch, currentSearch } from './script.js' 

// Para Trending
export const getObserver = (node) => { 
  observer.observe(node) 
} 

const inViewPort = ([e]) => { 
  const { isIntersecting, target } = e
  if (isIntersecting) {
    mainFunction()
    observer.unobserve(target) 
  }
}

const observer = new IntersectionObserver(inViewPort)

// Para Search
export const getObserverSearch = (node) => { 
  observerSearch.observe(node) 
}

const inViewPort2 = ([e]) => { 
  const { isIntersecting, target } = e
  if (isIntersecting) {
    mainFunctionSearch(currentSearch)
    observerSearch.unobserve(target) 
  }
}

const observerSearch = new IntersectionObserver(inViewPort2)