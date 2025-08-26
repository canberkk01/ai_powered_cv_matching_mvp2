document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('matching-form');
    const resultsSection = document.getElementById('results-section');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultsContent = document.getElementById('results-content');
    const analyzeBtn = document.querySelector('.analyze-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const originalBtnText = analyzeBtn.textContent;
        analyzeBtn.textContent = 'Analiz ediliyor...';
        analyzeBtn.disabled = true;
        
        resultsSection.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        resultsContent.style.display = 'none';
        
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        const formData = new FormData(form);
        const formDataObj = {};
        for (const [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }
        
        fetch(form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingIndicator.style.display = 'none';
            resultsContent.style.display = 'block';
            
            // Display results
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.style.display = 'none';
            resultsContent.innerHTML = `<p class="error-message">Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>`;
            resultsContent.style.display = 'block';
        })
        .finally(() => {
            analyzeBtn.textContent = originalBtnText;
            analyzeBtn.disabled = false;
        });
    });
    
    function displayResults(data) {
        // Update compatibility score
        const scoreElement = document.getElementById('compatibility-score');
        const score = data.uygunlukPuani !== undefined ? data.uygunlukPuani : 0;
        scoreElement.textContent = score;
        
        // Update reasons list
        const reasonsList = document.getElementById('reasons-list');
        reasonsList.innerHTML = '';
        if (data.puanNedenleri && Array.isArray(data.puanNedenleri) && data.puanNedenleri.length > 0) {
            data.puanNedenleri.forEach(reason => {
                const li = document.createElement('li');
                li.textContent = reason;
                reasonsList.appendChild(li);
            });
        } else {
            reasonsList.innerHTML = '<li>Neden belirtilmemiş.</li>';
        }
        
        // Update strengths list
        const strengthsList = document.getElementById('strengths-list');
        strengthsList.innerHTML = '';
        if (data.cvGucluYonleri && Array.isArray(data.cvGucluYonleri) && data.cvGucluYonleri.length > 0) {
            data.cvGucluYonleri.forEach(strength => {
                const li = document.createElement('li');
                li.textContent = strength;
                strengthsList.appendChild(li);
            });
        } else {
            strengthsList.innerHTML = '<li>Güçlü yön belirtilmemiş.</li>';
        }
        
        // Update missing skills list
        const missingSkillsList = document.getElementById('missing-skills-list');
        missingSkillsList.innerHTML = '';
        if (data.eksikBeceriler && Array.isArray(data.eksikBeceriler) && data.eksikBeceriler.length > 0) {
            data.eksikBeceriler.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                missingSkillsList.appendChild(li);
            });
        } else {
            missingSkillsList.innerHTML = '<li>Eksik beceri belirtilmemiş.</li>';
        }
        
        // Apply color to score based on value
        const scoreCircle = document.querySelector('.score-circle');
        if (score >= 75) {
            scoreCircle.style.borderColor = '#10B981';
            scoreCircle.style.color = '#10B981';
        } else if (score >= 50) {
            scoreCircle.style.borderColor = '#F59E0B';
            scoreCircle.style.color = '#F59E0B';
        } else {
            scoreCircle.style.borderColor = '#EF4444';
            scoreCircle.style.color = '#EF4444';
        }
    }
});