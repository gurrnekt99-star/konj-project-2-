const URL = "https://teachablemachine.withgoogle.com/models/38rI8dBVk/";

let model, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const resultContainer = document.getElementById('result-container');
const labelContainerElement = document.getElementById('label-container');
const loading = document.getElementById('loading');
const uploadSection = document.querySelector('.upload-section');

imageUpload.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            uploadSection.classList.add('hidden');
            loading.classList.remove('hidden');

            if (!model) {
                await init();
            }

            // Small delay to ensure image is rendered
            imagePreview.onload = async () => {
                await predict();
                loading.classList.add('hidden');
                resultContainer.classList.remove('hidden');
            };
        };

        reader.readAsDataURL(file);
    }
});

async function predict() {
    const prediction = await model.predict(imagePreview);
    labelContainerElement.innerHTML = '';

    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);

    const resultTitle = document.createElement('div');
    const topResult = prediction[0];
    const animalName = topResult.className === 'dog' ? '강아지상' : '고양이상';
    resultTitle.innerHTML = `<h3>당신은 <span style="color: #ff7e5f">${animalName}</span> 입니다!</h3>`;
    labelContainerElement.appendChild(resultTitle);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className === 'dog' ? '강아지' : '고양이';
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barContainer = document.createElement('div');
        barContainer.style.marginBottom = '10px';
        barContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>${classPrediction}</span>
                <span>${probability}%</span>
            </div>
            <div class="result-bar">
                <div class="result-fill" style="width: ${probability}%"></div>
            </div>
        `;
        labelContainerElement.appendChild(barContainer);
    }
}
