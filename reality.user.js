// ==UserScript==
// @name           MHD Links in reality websites
// @description    MHD Links in reality websites
// @include        http://www.sreality.cz/*
// @version        1.0
// ==/UserScript==

const addLinks = () => {
  console.log('found', document.querySelectorAll('.locality').length, 'addresses');
  const transportLink = (start, destination) => `<a target=_blank href="http://jizdnirady.idnes.cz/vlakyautobusymhd/spojeni/?f=${encodeURIComponent(start)}&t=${encodeURIComponent(destination)}&date=31.3.2016&time=8:30">${destination}</a>`;

  Array.prototype.slice.call(document.querySelectorAll('.locality, .location'))
  .filter(el => { const address = el.innerText.match(/(.+Praha).*/); return address && address[1] ? el : null; })
  .forEach(el => { const shortAddress = el.innerText.match(/(.+Praha).*/)[1]; el.innerHTML += `; Dojezd na: ${transportLink(shortAddress, 'Výtoň')}, ${transportLink(shortAddress, 'Anděl')}`; })
}

var target = document.querySelector('[ng-view]').parentNode;
var observer = new MutationObserver(function() {
  // page changed
  setTimeout(addLinks, 3000);
});
observer.observe(target, { childList: true });

// first run
setTimeout(addLinks, 3000);
