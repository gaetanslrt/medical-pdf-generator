// Variables globales
let currentStep = 1;
const totalSteps = 4;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    setupFileUpload();
    setupFormValidation();
});

// Gestion des étapes du formulaire
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            hideStep(currentStep);
            currentStep++;
            showStep(currentStep);
            updateProgress();
            updateNavigationButtons();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        hideStep(currentStep);
        currentStep--;
        showStep(currentStep);
        updateProgress();
        updateNavigationButtons();
    }
}

function showStep(stepNumber) {
    const step = document.getElementById(`step${stepNumber}`);
    if (step) {
        step.classList.add('active');
        step.style.animation = 'slideIn 0.5s ease';
    }
}

function hideStep(stepNumber) {
    const step = document.getElementById(`step${stepNumber}`);
    if (step) {
        step.classList.remove('active');
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepElement = document.getElementById('currentStep');
    const totalStepsElement = document.getElementById('totalSteps');
    
    if (progressFill) {
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    if (currentStepElement) {
        currentStepElement.textContent = currentStep;
    }
    
    if (totalStepsElement) {
        totalStepsElement.textContent = totalSteps;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentStep < totalSteps ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.style.display = currentStep === totalSteps ? 'flex' : 'none';
    }
}

// Validation des étapes
function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    // Réinitialiser les erreurs
    clearErrors();
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'Ce champ est obligatoire');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Format d\'email invalide');
            isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
            showError(field, 'Format de téléphone invalide');
            isValid = false;
        }
    });
    
    return isValid;
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('error');
        
        // Supprimer l'ancien message d'erreur s'il existe
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Ajouter le nouveau message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }
}

function clearErrors() {
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => {
        group.classList.remove('error');
        const errorMessage = group.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
}

// Validation des formats
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Configuration du téléchargement de fichiers
function setupFileUpload() {
    const fileInput = document.getElementById('photo');
    const fileLabel = document.querySelector('.file-label');
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileName = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
                fileLabel.innerHTML = `<i class="fas fa-check-circle"></i> <span>${fileName}</span>`;
                fileLabel.style.borderColor = 'var(--success-color)';
                fileLabel.style.background = 'rgba(16, 185, 129, 0.1)';
            }
        });
    }
}

// Configuration de la validation en temps réel
function setupFormValidation() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.error-message');
    
    if (existingError) {
        existingError.remove();
    }
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'Ce champ est obligatoire');
        return false;
    }
    
    if (field.value.trim()) {
        if (field.type === 'email' && !isValidEmail(field.value)) {
            showError(field, 'Format d\'email invalide');
            return false;
        }
        
        if (field.type === 'tel' && !isValidPhone(field.value)) {
            showError(field, 'Format de téléphone invalide');
            return false;
        }
        
        // Si tout est valide, supprimer l'erreur
        formGroup.classList.remove('error');
        return true;
    }
    
    return true;
}

// Fonction pour générer le PDF de suivi médical
function generateMedicalPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF is not loaded!");
        showNotification('Erreur: jsPDF non chargé', 'error');
        return;
    }
    
    showLoadingState();
    
    try {
        const doc = new jsPDF();

        // Récupération des données du formulaire
        const firstName = localStorage.getItem("first-name") || "Inconnu";
        const lastName = (localStorage.getItem("last-name") || "Inconnu").toUpperCase();
        const sex = localStorage.getItem("sex") || "N/A";
        const age = localStorage.getItem("age") || "N/A";
        const weight = localStorage.getItem("weight") || "N/A";
        const height = localStorage.getItem("height") || "N/A";
        const bloodGroup = localStorage.getItem("blood-group") || "N/A";
        const postal = localStorage.getItem("postal-code") || "N/A";
        const city = localStorage.getItem("city") || "N/A";
        const address = localStorage.getItem("address") || "N/A";
        const phone = localStorage.getItem("phone") || "N/A";
        const emergency = localStorage.getItem("emergency-contact") || "N/A";
        const emergencyPhone = localStorage.getItem("emergency-phone") || "N/A";
        const lastVisit = localStorage.getItem("last-consultation") || "N/A";
        const doctor = localStorage.getItem("doctor") || "N/A";
        const symptoms = localStorage.getItem("symptoms") || "Aucun";
        const history = localStorage.getItem("history") || "Aucun";
        const treatment = localStorage.getItem("treatment") || "Aucun";
        const notes = localStorage.getItem("notes") || "Aucune remarque";
        const photoData = localStorage.getItem("photo");

        // Titre principal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 51, 102);
        doc.text("Suivi Médical - Fiche Patient", 20, 20);

        // Ajout de la photo si disponible
        if (photoData) {
            console.log("Photo trouvée, ajout au PDF");
            doc.addImage(photoData, 'JPEG', 140, 10, 50, 50);
        } else {
            console.log("Aucune photo trouvée dans localStorage");
        }

        // Nom du patient
        doc.setFontSize(33);
        doc.setTextColor(0, 0, 0);
        doc.text(`${firstName}`, 20, 33);
        doc.text(`${lastName}`, 20, 45);

        // Informations du patient
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(0, 51, 102);
        doc.rect(20, 50, 115, 10, 'F');
        doc.text("Informations du patient", 23, 57);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Sexe :", 20, 67);
        doc.text(sex, 65, 67);

        doc.setFillColor(230, 230, 230);
        doc.rect(19, 70, 110, 5, 'F');
        
        doc.setFont("helvetica", "normal");
        doc.text("Né(e) le :", 20, 74);
        doc.text(age, 65, 74);

        doc.setFont("helvetica", "normal");
        doc.text("Poids :", 20, 81);
        doc.text(`${weight} kg`, 65, 81);

        doc.setFillColor(230, 230, 230);
        doc.rect(19, 84, 110, 5, 'F');
        
        doc.setFont("helvetica", "normal");
        doc.text("Taille :", 20, 88);
        doc.text(`${height} cm`, 65, 88);

        doc.setFont("helvetica", "normal");
        doc.text("Groupe sanguin :", 20, 95);
        doc.text(bloodGroup, 65, 95);

        doc.setFillColor(230, 230, 230);
        doc.rect(19, 98, 110, 5, 'F');
        
        doc.setFont("helvetica", "normal");
        doc.text("Adresse :", 20, 102);
        doc.text(`${address}, ${postal} ${city}`, 65, 102);
        
        doc.setFont("helvetica", "normal");
        doc.text("Téléphone :", 20, 109);
        doc.text(phone, 65, 109);

        doc.setFillColor(230, 230, 230);
        doc.rect(19, 112, 110, 5, 'F');

        doc.setFont("helvetica", "normal");
        doc.text("Contact d'urgence :", 20, 116);
        doc.text(emergency, 65, 116);

        doc.setFont("helvetica", "normal");
        doc.text("Téléphone d'urgence :", 20, 123);
        doc.text(emergencyPhone, 65, 123);

        doc.setFillColor(230, 230, 230);
        doc.rect(19, 126, 110, 5, 'F');

        doc.setFont("helvetica", "normal");
        doc.text("Dernière consultation :", 20, 130);
        doc.text(lastVisit, 65, 130);

        doc.setFont("helvetica", "normal");
        doc.text("Médecin traitant : ", 20, 137);
        doc.text("Dr " + doctor, 65, 137);

        // Sections avec couleurs
        function addSection(title, content, yPosition) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(0, 51, 102);
            doc.rect(20, yPosition, 170, 10, 'F');
            doc.text(title, 23, yPosition + 7);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(doc.splitTextToSize(content, 160), 20, yPosition + 15);
        }

        addSection("Symptômes récents", symptoms, 145);
        addSection("Antécédents médicaux", history, 185);
        addSection("Traitements en cours", treatment, 225);
        addSection("Notes supplémentaires", notes, 265);

        // Mention en bas à droite
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text("Généré avec MediTrack Pro - meditrackpro.pages.dev", 70, 293);

        doc.save("suivi_medical.pdf");
        
        hideLoadingState();
        showNotification('PDF généré avec succès !', 'success');
        
        // Nettoyer le localStorage après génération
        setTimeout(() => {
            clearLocalStorage();
        }, 3000);
        
    } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        hideLoadingState();
        showNotification('Erreur lors de la génération du PDF', 'error');
    }
}

// Fonction de soumission du formulaire
function submitMedicalForm(event) {
    event.preventDefault();
    
    if (!validateCurrentStep()) {
        showNotification('Veuillez corriger les erreurs avant de continuer', 'error');
        return;
    }

    // Sauvegarder les données
    saveFormData();
    
    // Attendre un peu pour s'assurer que la photo est sauvegardée
    setTimeout(() => {
        generateMedicalPDF();
    }, 500);
}

function saveFormData() {
    const fields = [
        'first-name', 'last-name', 'sex', 'age', 'weight', 'height', 'blood-group',
        'postal-code', 'city', 'address', 'phone', 'emergency-contact', 'emergency-phone',
        'last-consultation', 'doctor', 'symptoms', 'history', 'treatment', 'notes'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            localStorage.setItem(fieldId, element.value);
        }
    });

    // Gérer la photo
    const photoInput = document.getElementById("photo");
    if (photoInput && photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
            localStorage.setItem("photo", event.target.result);
            console.log("Photo sauvegardée dans localStorage");
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        console.log("Aucune photo sélectionnée");
    }
}

// États de chargement et notifications
function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter les styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function clearLocalStorage() {
    const fields = [
        'first-name', 'last-name', 'sex', 'age', 'weight', 'height', 'blood-group',
        'postal-code', 'city', 'address', 'phone', 'emergency-contact', 'emergency-phone',
        'last-consultation', 'doctor', 'symptoms', 'history', 'treatment', 'notes', 'photo'
    ];
    
    fields.forEach(field => {
        localStorage.removeItem(field);
    });
}

// Animations CSS pour les notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
