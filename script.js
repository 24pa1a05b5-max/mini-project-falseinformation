
const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
const isDashboardPage = window.location.pathname.includes('dashboard.html');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeButtonText();
}

function setTheme(mode) {
    if (mode === 'light') {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeButtonText();
}

function toggleTheme() {
    if (document.body.classList.contains('light-mode')) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

function updateThemeButtonText() {
    const isLight = document.body.classList.contains('light-mode');
    const themeText = isLight ? 'Light' : 'Dark';
    const icon = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    
    const themeBtns = document.querySelectorAll('#themeToggle');
    themeBtns.forEach(btn => {
        if (btn) {
            btn.innerHTML = `${icon} <span>${themeText}</span>`;
        }
    });
}
if (isLoginPage) {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        
        const loginForm = document.getElementById('loginForm');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                sessionStorage.setItem('isLoggedIn', 'true');
                
                window.location.href = 'dashboard.html';
            });
        }
    });
}


if (isDashboardPage) {
   
    if (!sessionStorage.getItem('isLoggedIn')) {
       
        window.location.href = 'index.html';
    }
    
    let isAnalyzing = false;
    
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        
        // DOM Elements
        const logoutBtn = document.getElementById('logoutBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const statementInput = document.getElementById('statementInput');
        const urlInput = document.getElementById('urlInput');
        const imageUpload = document.getElementById('imageUpload');
        const imageLabel = document.getElementById('imageLabel');
        const imageNameSpan = document.getElementById('imageName');
        const resultArea = document.getElementById('resultArea');
        const credibilityScoreSpan = document.getElementById('credibilityScore');
        const progressFill = document.getElementById('progressFill');
        const colorIndicatorSpan = document.getElementById('colorIndicator');
        const reviewMsgDiv = document.getElementById('reviewMessage');
        const themeToggle = document.getElementById('themeToggle');
        
      
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
     
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                sessionStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            });
        }
        
   r
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                if (e.target.files.length > 0 && imageNameSpan) {
                    imageNameSpan.innerText = `📎 ${e.target.files[0].name.substring(0, 25)}`;
                } else if (imageNameSpan) {
                    imageNameSpan.innerText = '';
                }
            });
        }
        
        if (imageLabel) {
            imageLabel.addEventListener('click', () => {
                if (imageUpload) imageUpload.click();
            });
        }
        
     
        function simulateAIAnalysis() {
            return new Promise((resolve) => {
                const randomScore = Math.floor(Math.random() * 101);
                setTimeout(() => {
                    resolve(randomScore);
                }, 800);
            });
        }
   
        function renderResult(score) {
            if (credibilityScoreSpan) {
                credibilityScoreSpan.innerText = `${score}%`;
            }
            
            if (progressFill) {
                progressFill.style.width = `${score}%`;
            }
            
            const isReliable = score >= 50;
            
            if (colorIndicatorSpan && reviewMsgDiv) {
                if (isReliable) {
                    colorIndicatorSpan.innerHTML = `<span style="color:#10b981;"><i class="fas fa-check-circle"></i> 🟢 Credibility: High · ${score}% reliable</span>`;
                    reviewMsgDiv.innerHTML = `<i class="fas fa-robot"></i> ✅ This information appears to be reliable based on AI analysis. Confidence score reflects pattern matching against verified sources.`;
                    if (progressFill) progressFill.style.backgroundColor = '#10b981';
                } else {
                    colorIndicatorSpan.innerHTML = `<span style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> 🔴 Credibility: Low · ${score}% suspicious</span>`;
                    reviewMsgDiv.innerHTML = `<i class="fas fa-robot"></i> ⚠️ This information may be misleading or false. Please verify from trusted sources. AI detected inconsistent patterns and questionable references.`;
                    if (progressFill) progressFill.style.backgroundColor = '#ef4444';
                }
            }
            
            if (resultArea) {
                resultArea.style.borderLeft = `4px solid ${isReliable ? '#10b981' : '#ef4444'}`;
            }
        }

        async function onAnalyze() {
            if (isAnalyzing) return;
            
            const statement = statementInput ? statementInput.value.trim() : '';
            const url = urlInput ? urlInput.value.trim() : '';
            const hasImage = imageUpload && imageUpload.files.length > 0;
            
            if (!statement && !url && !hasImage) {
                alert("📌 Please enter a statement, URL, or upload an image to analyze.");
                return;
            }
            
            isAnalyzing = true;
            const originalBtnText = analyzeBtn ? analyzeBtn.innerHTML : '';
            
            if (analyzeBtn) {
                analyzeBtn.innerHTML = `<span class="loading"></span> Analyzing...`;
                analyzeBtn.disabled = true;
            }
            
            if (resultArea) {
                resultArea.classList.remove('hidden');
                if (progressFill) progressFill.style.width = `0%`;
                if (credibilityScoreSpan) credibilityScoreSpan.innerText = `~%`;
                if (colorIndicatorSpan) colorIndicatorSpan.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> AI scanning...`;
                if (reviewMsgDiv) reviewMsgDiv.innerHTML = `🤖 Processing content through neural misinformation model...`;
            }
            
            const fakeScore = await simulateAIAnalysis();
            renderResult(fakeScore);
            
            const inputsUsed = [];
            if (statement) inputsUsed.push("text");
            if (url) inputsUsed.push("url");
            if (hasImage) inputsUsed.push("image");
            
            if (inputsUsed.length > 0 && reviewMsgDiv) {
                const footnote = document.createElement('small');
                footnote.style.display = 'block';
                footnote.style.marginTop = '12px';
                footnote.style.fontSize = '0.7rem';
                footnote.style.opacity = '0.8';
                footnote.innerHTML = `<i class="fas fa-chart-line"></i> Analyzed based on: ${inputsUsed.join(', ')} | AI confidence simulation`;
                
                const oldFootnotes = reviewMsgDiv.querySelectorAll('.dynamic-footnote');
                oldFootnotes.forEach(fn => fn.remove());
                
                footnote.classList.add('dynamic-footnote');
                reviewMsgDiv.appendChild(footnote);
            }
            
            if (analyzeBtn) {
                analyzeBtn.innerHTML = originalBtnText;
                analyzeBtn.disabled = false;
            }
            
            isAnalyzing = false;
        }
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', onAnalyze);
        }
    });
}