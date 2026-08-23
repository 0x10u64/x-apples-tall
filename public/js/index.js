async function getImageDimensions(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const { width, height } = bitmap;
        bitmap.close();
        return { width, height };
    } catch (e) {
        throw new Error("could not decode!! (file may be corrupted or unsupported)");
    }
}

document.getElementById("fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageElement = document.getElementById("image");
    imageElement.src = URL.createObjectURL(file);

    const errorElement = document.getElementById("error");
    errorElement.textContent = "";

    try {
        const { width, height } = await getImageDimensions(file);
        if (height == 0) throw new Error("image has zero height and you can't do that bc I said so");
        const aspectRatio = width / height;

        if (aspectRatio > 1) {
            throw new Error("your image is not tall enough!!");
        }

        requestAnimationFrame(() => {
            const applesElement = document.getElementById("apples");

            const appleUnit = `${imageElement.clientHeight * aspectRatio}px`;
            applesElement.style.width = appleUnit;
            applesElement.style.height = `${imageElement.clientHeight}px`;
            applesElement.style.backgroundSize = `${appleUnit} ${appleUnit}`

            const apples = Math.ceil(height / width - 0.5);
            const plural = apples > 1 ? "s" : "";
            document.getElementById("result").textContent = `${apples} apple${plural} tall`;

            document.getElementById("result-subtext").textContent = "x-apples-tall.0x10u64.vercel.app";
        });
    } catch (error) {
        errorElement.textContent = `failed to measure!! ${error.message}`;
    }
});

