/* checkbox */
document.querySelectorAll(".check-box label").forEach(label => {
  const input = label.querySelector("input");

  label.addEventListener("click", () => {
    input.checked = !input.checked;
    label.classList.toggle("checked", input.checked);
  });
});

/* dark mode */
const darkToggle = document.getElementById("darkToggle");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark")
    ? "Light"
    : "Dark";
});

/* language toggle */
const langToggle = document.getElementById("langToggle");
let currentLang = "ko";

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "ko" ? "en" : "ko";
  langToggle.textContent = currentLang === "ko" ? "EN" : "KO";

  document.querySelectorAll("[data-ko][data-en]").forEach(el => {
    el.textContent = el.dataset[currentLang];
  });

  document.querySelectorAll("[data-ko-placeholder][data-en-placeholder]").forEach(el => {
    el.placeholder = currentLang === "ko"
      ? el.dataset.koPlaceholder
      : el.dataset.enPlaceholder;
  });
});

/* image upload + delete */
document.querySelectorAll(".upload").forEach(upload => {
  const input = upload.querySelector(".imageInput");
  const preview = upload.querySelector(".preview");
  const removeBtn = upload.querySelector(".remove-file");

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
      preview.src = e.target.result;
      preview.style.display = "block";
      upload.classList.add("has-file");
    };

    reader.readAsDataURL(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      input.value = "";
      preview.removeAttribute("src");
      preview.style.display = "none";
      upload.classList.remove("has-file");
    });
  }
});

/* export JPG */
const exportImageBtn = document.getElementById("exportImage");

exportImageBtn.addEventListener("click", () => {
  const area = document.getElementById("captureArea");

  html2canvas(area, {
    scale: 2,
    useCORS: true,
    backgroundColor: document.body.classList.contains("dark") ? "#0a0a0a" : "#ffffff"
  }).then(canvas => {
    const link = document.createElement("a");
    link.download = "checklist.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  });
});

/* export PDF */
const exportPDFBtn = document.getElementById("exportPDF");

exportPDFBtn.addEventListener("click", () => {
  const area = document.getElementById("captureArea");

  const opt = {
    margin: 0,
    filename: "checklist.pdf",
    image: {
      type: "jpeg",
      quality: 1
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: document.body.classList.contains("dark") ? "#0a0a0a" : "#ffffff"
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"]
    }
  };

  html2pdf().set(opt).from(area).save();
});
