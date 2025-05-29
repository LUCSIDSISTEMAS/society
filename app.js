const API_URL = "https://script.google.com/macros/s/AKfycbzI8UEco1hNeW7mXiNEp9RPK3Z35YGBbBCSMtipbp93_G0BGJ2K-1QnFJIzd-jcydkPKw/exec";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("videos-container");

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    data.forEach((evento, index) => {
      const bloco = document.createElement("div");
      bloco.innerHTML = `
        <h3 class="mb-3">${evento.title}</h3>
        <div class="carousel-scroll">
          ${evento.videos.map((url, i) => `
            <div class="video-card">
              <iframe 
                data-src="${url}" 
                class="w-100 rounded shadow-sm aspect-ratio bg-black" 
                height="160"
                allowfullscreen
              ></iframe>
              <p class="text-center text-secondary mt-1">Câmera ${i + 1}</p>
            </div>
          `).join('')}
        </div>
      `;
      container.appendChild(bloco);
    });

    lazyLoadIframes();
  } catch (error) {
    container.innerHTML = `<p class="text-danger text-center">Erro ao carregar vídeos.</p>`;
    console.error("Erro ao buscar vídeos:", error);
  }
});

function lazyLoadIframes() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        iframe.src = iframe.dataset.src;
        obs.unobserve(iframe);
      }
    });
  });

  document.querySelectorAll("iframe[data-src]").forEach(iframe => {
    observer.observe(iframe);
  });
}
