const els = {
    input: document.getElementById("fileInput"),
    image: document.getElementById("image"),
    apples: document.getElementById("apples"),
    error: document.getElementById("error"),
    result: document.getElementById("result"),
    resultSubtext: document.getElementById("result-subtext"),
};

let currentObjectUrl = null;

async function getImageDimensions(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;
        bitmap.close();
        return { width, height };
    } catch {
        throw new Error("could not decode!! (file may be corrupted or unsupported)");
    }
}

async function handleFile(file) {
    els.apples.style.display = "none";
    els.error.textContent = "";
    els.result.textContent = "";
    els.resultSubtext.textContent = "";

    if (!file.type.startsWith("image/")) {
        throw new Error("that's not an image!!");
    }

    if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = URL.createObjectURL(file);
    els.image.src = currentObjectUrl;

    const { width, height } = await getImageDimensions(file);
    if (height === 0) throw new Error("image has zero height and you can't do that");

    const aspectRatio = width / height;
    if (aspectRatio > 1) throw new Error("your image is not tall enough!!");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const appleUnit = `${els.image.clientHeight * aspectRatio}px`;
            els.apples.style.display = "block";
            els.apples.style.width = appleUnit;
            els.apples.style.height = `${els.image.clientHeight}px`;
            els.apples.style.backgroundSize = `${appleUnit} ${appleUnit}`;

            const apples = Math.ceil(height / width - 0.5);
            const plural = apples > 1 ? "s" : "";
            els.result.textContent = `${apples} apple${plural} tall`;
            els.resultSubtext.textContent = "x-apples-tall.ext.io";
        });
    });
}

els.input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    els.input.disabled = true;
    try {
        await handleFile(file);
    } catch (error) {
        els.error.textContent = `failed to measure!! ${error.message}`;
    } finally {
        els.input.disabled = false;
    }
});
