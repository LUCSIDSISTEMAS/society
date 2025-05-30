const API_URL = "https://script.google.com/macros/s/AKfycbzI8UEco1hNeW7mXiNEp9RPK3Z35YGBbBCSMtipbp93_G0BGJ2K-1QnFJIzd-jcydkPKw/exec";

document.addEventListener("DOMContentLoaded", showOptions);

function showOptions() {
  const options = document.getElementById("options");
  options.innerHTML = `
    <div class="col-5 option-box" onclick="loadDates(this)">⚽ Society</div>
    <div class="col-5 option-box text-muted" onclick="alert('🏖️ Areia ainda não está disponível')">🏖️ Areia</div>
  `;

  document.getElementById("date-selector").innerHTML = "";
  document.getElementById("videos-container").innerHTML = "";
}

async function loadDates(buttonElement) {
  const originalText = buttonElement.innerHTML;
  buttonElement.innerHTML = `<span class="loading-icon"></span> Carregando...`;

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const datas = [...new Set(data.map(d => d.title.split(" - ")[0]))].sort().reverse();

    const selector = document.getElementById("date-selector");
    selector.innerHTML = `<h3 class="mb-3">Selecione uma data:</h3>`;
    datas.forEach(dataStr => {
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-light m-1";
      btn.textContent = dataStr;
      btn.onclick = () => {
        const videosDoDia = data.filter(d => d.title.startsWith(dataStr));
        renderVideos(videosDoDia);
      };
      selector.appendChild(btn);
    });
  } catch (err) {
    alert("Erro ao buscar datas.");
    console.error(err);
  } finally {
    buttonElement.innerHTML = originalText;
  }
}

function renderVideos(eventos) {
  const container = document.getElementById("videos-container");
  container.innerHTML = "";

  eventos.forEach((evento, index) => {
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
}

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
