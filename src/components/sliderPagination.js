export default function (paginationContainer, slidesContainer, slider) {
  const slides = document.querySelectorAll(slidesContainer);
  const container = document.querySelector(paginationContainer);
  container.innerHTML = `1/${slides.length - 2}`;

  slider.events.on('indexChanged', (e) => {
    if (e.index > slides.length - 2) {
      container.innerHTML = `1/${slides.length - 2}`;
    } else if (e.index <= 0) {
      container.innerHTML = `${slides.length - 2}/${slides.length - 2}`;
    } else {
      container.innerHTML = `${e.index}/${slides.length - 2}`;
    }
  });
}
