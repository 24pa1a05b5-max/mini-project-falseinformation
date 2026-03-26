const isLoginPage =
  window.location.pathname.includes("index.html") ||
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/");

const isDashboardPage =
  window.location.pathname.includes("dashboard.html");



function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeButtonText();
}

function setTheme(mode) {
  if (mode === "light") {
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
  updateThemeButtonText();
}

function toggleTheme() {
  if (document.body.classList.contains("light-mode")) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
}

function updateThemeButtonText() {
  const isLight = document.body.classList.contains("light-mode");
  const themeText = isLight ? "Light" : "Dark";
  const icon = isLight
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';

  const themeBtns = document.querySelectorAll("#themeToggle");
  themeBtns.forEach((btn) => {
    if (btn) {
      btn.innerHTML = `${icon} <span>${themeText}</span>`;
    }
  });
}



if (isLoginPage) {
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const loginForm = document.getElementById("loginForm");
    const themeToggle = document.getElementById("themeToggle");

    
    if (sessionStorage.getItem("isLoggedIn")) {
      window.location.href = "dashboard.html";
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document
          .getElementById("username")
          .value.trim();
        const password = document.getElementById("password").value.trim();

        if (username === "" || password === "") {
          alert("Please enter username and password");
          return;
        }

      
        sessionStorage.setItem("isLoggedIn", "true");

       
        window.location.href = "dashboard.html";
      });
    }
  });
}



if (isDashboardPage) {

  if (!sessionStorage.getItem("isLoggedIn")) {
    window.location.href = "index.html";
  }

  let isAnalyzing = false;

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    
    const logoutBtn = document.getElementById("logoutBtn");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const statementInput = document.getElementById("statementInput");
    const urlInput = document.getElementById("urlInput");
    const imageUpload = document.getElementById("imageUpload");
    const imageLabel = document.getElementById("imageLabel");
    const imageNameSpan = document.getElementById("imageName");
    const resultArea = document.getElementById("resultArea");
    const credibilityScoreSpan =
      document.getElementById("credibilityScore");
    const progressFill = document.getElementById("progressFill");
    const colorIndicatorSpan =
      document.getElementById("colorIndicator");
    const reviewMsgDiv = document.getElementById("reviewMessage");
    const themeToggle = document.getElementById("themeToggle");

    
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

  
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("isLoggedIn");

       
        if (imageUpload) imageUpload.value = "";
        if (imageNameSpan) imageNameSpan.innerText = "";

        window.location.href = "index.html";
      });
    }

    
    if (imageUpload) {
      imageUpload.addEventListener("change", (e) => {
        if (e.target.files.length > 0 && imageNameSpan) {
          imageNameSpan.innerText = `📎 ${e.target.files[0].name.substring(
            0,
            25
          )}`;
        } else if (imageNameSpan) {
          imageNameSpan.innerText = "";
        }
      });
    }

    if (imageLabel) {
      imageLabel.addEventListener("click", () => {
        imageUpload.click();
      });
    }

    
    function simulateAIAnalysis() {
      return new Promise((resolve) => {
        const randomScore = Math.floor(Math.random() * 101);
        setTimeout(() => resolve(randomScore), 800);
      });
    }

    
    function renderResult(score) {
      credibilityScoreSpan.innerText = `${score}%`;
      progressFill.style.width = `${score}%`;

      const isReliable = score >= 50;

      if (isReliable) {
        colorIndicatorSpan.innerHTML = `<span style="color:#10b981;">🟢 High · ${score}% reliable</span>`;
        reviewMsgDiv.innerHTML =
          "✅ This information appears reliable.";
        progressFill.style.backgroundColor = "#10b981";
      } else {
        colorIndicatorSpan.innerHTML = `<span style="color:#ef4444;">🔴 Low · ${score}% suspicious</span>`;
        reviewMsgDiv.innerHTML =
          "⚠️ This information may be misleading.";
        progressFill.style.backgroundColor = "#ef4444";
      }

      resultArea.style.borderLeft = `4px solid ${
        isReliable ? "#10b981" : "#ef4444"
      }`;
    }

    
    async function onAnalyze() {
      if (isAnalyzing) return;

      const statement = statementInput.value.trim();
      const url = urlInput.value.trim();
      const hasImage = imageUpload.files.length > 0;

      if (!statement && !url && !hasImage) {
        alert("Please enter text, URL, or image");
        return;
      }

      isAnalyzing = true;
      const originalBtnText = analyzeBtn.innerHTML;

      analyzeBtn.innerHTML = "Analyzing...";
      analyzeBtn.disabled = true;

      resultArea.classList.remove("hidden");

      progressFill.style.width = "0%";
      credibilityScoreSpan.innerText = "~%";
      colorIndicatorSpan.innerHTML = "AI scanning...";
      reviewMsgDiv.innerHTML = "Processing...";

      const score = await simulateAIAnalysis();

      renderResult(score);

      analyzeBtn.innerHTML = originalBtnText;
      analyzeBtn.disabled = false;

      isAnalyzing = false;
    }

    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", onAnalyze);
    }
  });
}