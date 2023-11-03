pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.6.172/build/pdf.worker.min.js";

const inputPdf = document.querySelector('#input-pdf')
async function getPdfText(data) {
    let doc = await pdfjsLib.getDocument({data}).promise;
    let pageTexts = Array.from({length: doc.numPages}, async (v,i) => {
        return (await (await doc.getPage(i+1)).getTextContent()).items
            .map(token => token.str)
            .join('');
    });
    return (await Promise.all(pageTexts)).join('\n\n ### Separador de página ### \n\n');
}

inputPdf.addEventListener('change', async (ev) => {
    const loading = document.querySelector('.spinner')
    loading.style.display = 'block'
    const files = ev.target.files
    for (const file of files) {
        let buffer = await file.arrayBuffer();
        let text = await getPdfText(buffer);
        document.querySelector('.text').innerText = text;
    }
    loading.style.display = 'none'
})
