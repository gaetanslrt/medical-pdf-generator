// Fonction pour générer le PDF de suivi médical
function generateMedicalPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF is not loaded!");
        return;
    }
    const doc = new jsPDF();

    // Récupération des données du formulaire
    const firstName = localStorage.getItem("firstName") || "Inconnu";
    const lastName = (localStorage.getItem("lastName") || "Inconnu").toUpperCase();
    const sex = localStorage.getItem("sex") || "N/A";
    const age = localStorage.getItem("age") || "N/A";
    const weight = localStorage.getItem("weight") || "N/A";
    const height = localStorage.getItem("height") || "N/A";
    const bloodGroup = localStorage.getItem("blood-group") || "N/A";
    const postal = localStorage.getItem("postal") || "N/A";
    const city = localStorage.getItem("city") || "N/A";
    const address = localStorage.getItem("address") || "N/A";
    const phone = localStorage.getItem("phone") || "N/A";
    const emergency = localStorage.getItem("emergency") || "N/A";
    const emergencyPhone = localStorage.getItem("emergencyPhone") || "N/A";
    const lastVisit = localStorage.getItem("lastVisit") || "N/A";
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
        doc.addImage(photoData, 'JPEG', 140, 10, 50, 50);
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

    doc.save("suivi_medical.pdf");
}

// Fonction de soumission du formulaire
function submitMedicalForm(event) {
    event.preventDefault();

    // Récupération des valeurs
    localStorage.setItem("firstName", document.getElementById("first-name").value);
    localStorage.setItem("lastName", document.getElementById("last-name").value);
    localStorage.setItem("sex", document.getElementById("sex").value);
    localStorage.setItem("age", document.getElementById("age").value);
    localStorage.setItem("weight", document.getElementById("weight").value);
    localStorage.setItem("height", document.getElementById("height").value);
    localStorage.setItem("blood-group", document.getElementById("blood-group").value);
    localStorage.setItem("postal", document.getElementById("postal-code").value);
    localStorage.setItem("city", document.getElementById("city").value);
    localStorage.setItem("address", document.getElementById("address").value);
    localStorage.setItem("phone", document.getElementById("phone").value);
    localStorage.setItem("emergency", document.getElementById("emergency-contact").value);
    localStorage.setItem("emergencyPhone", document.getElementById("emergency-phone").value);
    localStorage.setItem("lastVisit", document.getElementById("last-consultation").value);
    localStorage.setItem("doctor", document.getElementById("doctor").value);
    localStorage.setItem("symptoms", document.getElementById("symptoms").value);
    localStorage.setItem("history", document.getElementById("history").value);
    localStorage.setItem("treatment", document.getElementById("treatment").value);
    localStorage.setItem("notes", document.getElementById("notes").value);

    // Récupération et stockage de la photo
    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function (event) {
            localStorage.setItem("photo", event.target.result);
            generateMedicalPDF();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        generateMedicalPDF();
    }
}
