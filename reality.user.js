// ==UserScript==
// @name           Public Transport Links in Real estate websites
// @description    Public Transport Links in Real estate websites
// @include        http://www.sreality.cz/*
// @include        http://www.bezrealitky.cz/*
// @version        1.0
// ==/UserScript==

const mutationTimeout = 1000
const viewSelector = '.transcluded-content, .panel-container'
const addressSelector = 'span.locality, span.location, .desc > h3 > a'
const addressRegexp = /^([^;]+Praha)[^;]+$/

const date = new Date()
const idosDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
const idosTime = '8:30'
const idosDestination = 'Svornosti 2, Praha'

// load Google Maps API (if not already loaded)
if (true) {
  const script = document.createElement('script')
  script.src = "http://maps.google.com/maps/api/js?sensor=false&key=AIzaSyD3Vk0rrlrDoz6IHYRuYp1D41w6wpWw854&callback=initMap"
  const appendParent = document.getElementsByTagName("head")[0] || document.body
  appendParent.appendChild(script)

  unsafeWindow.initMap = () => {
    // Google Maps API loaded
    // TODO: wait for load
  }
}

let called = false
const transportLink = (origin, destination) => {
  if (!called) {
    const directions = new google.maps.DirectionsService()
    directions.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.TRANSIT
    }, res => console.log(res.routes[0]))
    called = true
  }
  return`<a target="_blank" href="http://jizdnirady.idnes.cz/vlakyautobusymhd/spojeni/?f=${encodeURIComponent(origin)}&t=${encodeURIComponent(destination)}&date=${idosDate}&time=${idosTime}">${destination}</a>`;
}

const addLinks = () => {
  const addressElements = document.querySelectorAll(addressSelector)
  console.log('found', addressElements.length, 'addresses')

  Array.prototype.slice.call(addressElements)
  .filter(el => {
    const address = el.innerHTML.match(addressRegexp);
    return address && address[1] ? el : null;
  })
  .forEach(el => {
    const shortAddress = el.innerHTML.match(addressRegexp)[1];
    el.innerHTML += `; Dojezd na: ${transportLink(shortAddress, idosDestination)}`;
  })
}

const target = document.querySelector(viewSelector);
let timeout = null
const observer = new MutationObserver(function() {
  if (timeout) { return }
  console.log('page change detected')
  timeout = setTimeout(() => {
    addLinks()
    clearTimeout(timeout)
    timeout = null
  }, mutationTimeout);
});
observer.observe(target, { childList: true, subtree: true });

console.log('real estate userscript enabled')
setTimeout(addLinks, mutationTimeout);
