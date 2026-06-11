import { state, saveState, WASTE_TYPES } from '../data.js';

export const WasteDeclarationScreen = {
    render: () => {
        const wasteCards = Object.values(WASTE_TYPES).map(w => `
            <div class="card waste-type-card" data-id="${w.id}" style="cursor: pointer; text-align: center; border: 2px solid var(--border); border-radius: 16px; padding: 20px; transition: var(--transition);">
                <div style="font-size: 36px; margin-bottom: 8px;">${w.emoji}</div>
                <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">${w.name}</div>
                <div class="badge ${w.recyclable ? 'badge-success' : 'badge-warning'}" style="font-size: 10px;">
                    ${w.recyclable ? 'Recyclable (Revenue)' : 'Non-Recyclable'}
                </div>
            </div>
        `).join("");

        return `
        <div class="topbar animate-fade-in">
            <h1 class="page-title">Declare Waste Stream</h1>
        </div>
        
        <div class="card animate-fade-in" style="max-width: 800px; margin: 0 auto; padding: 32px;">
            <div style="margin-bottom: 24px;">
                <h3 style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; margin-bottom: 8px;">1. Select Waste Type</h3>
                <p style="color: var(--text-secondary); font-size: 14px;">Select the primary industrial waste category you want to process.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;" id="waste-cards-grid">
                ${wasteCards}
            </div>
            
            <form id="declaration-form" style="display: none;">
                <div style="margin-bottom: 24px;">
                    <h3 style="font-family: var(--font-heading); font-size: 20px; font-weight: 700; margin-bottom: 8px;">2. Waste Metrics</h3>
                    <p style="color: var(--text-secondary); font-size: 14px;">Provide approximate weights or volumes.</p>
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label class="form-label" style="margin-bottom: 0;">Total Weight (kg)</label>
                        <span id="weight-display" style="font-size: 18px; font-weight: 700; color: var(--primary-dark);">500 kg</span>
                    </div>
                    <input type="range" id="weight-slider" min="50" max="10000" step="50" value="500" style="width: 100%; height: 6px; background: #E2E8F0; border-radius: 3px; outline: none; accent-color: var(--primary);">
                </div>

                <div class="form-group" style="margin-bottom: 32px;">
                    <label class="form-label">Photo Upload (Optional)</label>
                    <div style="border: 2px dashed var(--border); border-radius: 12px; padding: 24px; text-align: center; background-color: var(--bg-light); cursor: pointer;" id="camera-upload-btn">
                        <i data-lucide="camera" style="width: 36px; height: 36px; color: var(--text-secondary); margin-bottom: 8px;"></i>
                        <p style="font-size: 14px; font-weight: 500;" id="photo-label">Take photo or select from gallery</p>
                        <input type="file" id="photo-file" accept="image/*" style="display: none;">
                    </div>
                    <div id="photo-preview-container" style="display: none; margin-top: 12px; text-align: center;">
                        <img id="photo-preview" style="max-height: 160px; border-radius: 10px; border: 1px solid var(--border);" alt="Preview">
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-full" style="padding: 14px; font-size: 16px;">
                    Analyze & Route Waste <i data-lucide="arrow-right"></i>
                </button>
            </form>
        </div>
        `;
    },
    afterRender: () => {
        let selectedWasteType = null;
        const form = document.getElementById("declaration-form");
        const cardsGrid = document.getElementById("waste-cards-grid");
        const weightSlider = document.getElementById("weight-slider");
        const weightDisplay = document.getElementById("weight-display");
        const cameraBtn = document.getElementById("camera-upload-btn");
        const fileInput = document.getElementById("photo-file");
        const photoLabel = document.getElementById("photo-label");
        const previewContainer = document.getElementById("photo-preview-container");
        const previewImg = document.getElementById("photo-preview");

        cardsGrid.addEventListener("click", (e) => {
            const card = e.target.closest(".waste-type-card");
            if (!card) return;

            // Remove active classes
            document.querySelectorAll(".waste-type-card").forEach(c => {
                c.style.borderColor = "var(--border)";
                c.style.backgroundColor = "white";
                c.style.transform = "none";
            });

            selectedWasteType = card.dataset.id;
            const wInfo = WASTE_TYPES[selectedWasteType];
            
            // Highlight selected card
            card.style.borderColor = "var(--primary)";
            card.style.backgroundColor = "var(--primary-light)";
            card.style.transform = "scale(1.02)";

            // Show input details
            form.style.display = "block";
            form.scrollIntoView({ behavior: "smooth" });
            
            // Update weight label context (L for oil, kg for others)
            weightDisplay.innerText = `${weightSlider.value} ${wInfo.unit}`;
        });

        weightSlider.addEventListener("input", (e) => {
            const wInfo = WASTE_TYPES[selectedWasteType];
            weightDisplay.innerText = `${e.target.value} ${wInfo ? wInfo.unit : 'kg'}`;
        });

        cameraBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    previewContainer.style.display = "block";
                    photoLabel.innerText = `📸 Photo attached successfully`;
                    photoLabel.style.color = "var(--primary-dark)";
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!selectedWasteType) return;

            const weight = parseInt(weightSlider.value);
            const wInfo = WASTE_TYPES[selectedWasteType];
            
            let value = 0;
            if (wInfo.recyclable) {
                value = weight * wInfo.pricePerKg; // Positive revenue
            } else {
                value = -(weight * wInfo.pricePerKg); // Negative cost
            }

            state.tempDeclaration = {
                wasteType: selectedWasteType,
                weight: weight,
                value: value,
                co2Avoided: Math.round(weight * wInfo.co2SavedPerKg)
            };

            saveState();
            window.location.hash = "/sme/result";
        });
    }
};
