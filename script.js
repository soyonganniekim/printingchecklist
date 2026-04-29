const langToggle = document.getElementById("langToggle");
let currentLang = "ko";

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ko" ? "en" : "ko";

    document.querySelectorAll("[data-ko]").forEach(el => {
      el.textContent = el.dataset[currentLang];
    });

    document.querySelectorAll("[data-ko-placeholder]").forEach(el => {
      el.placeholder = el.dataset[currentLang + "Placeholder"];
    });

    langToggle.textContent = currentLang === "ko" ? "EN" : "KO";
  });
}


const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}


document.querySelectorAll(".check-box input").forEach(input => {
  input.addEventListener("change", () => {
    input.parentElement.classList.toggle("checked", input.checked);
  });
});


document.querySelectorAll(".imageInput").forEach(input => {
  input.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = input.closest(".upload").querySelector(".preview");

    const reader = new FileReader();
    reader.onload = ev => {
      preview.src = ev.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  });
});


const exportImageBtn = document.getElementById("exportImage");

if (exportImageBtn) {
  exportImageBtn.addEventListener("click", async () => {
    const area = document.getElementById("captureArea");

    document.body.classList.add("exporting-pdf");

    const canvas = await html2canvas(area, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    document.body.classList.remove("exporting-pdf");

    const link = document.createElement("a");
    link.download = "checklist.jpg";
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
  });
}


//*pdf*//

const exportPDFBtn = document.getElementById("exportPDF");

if (exportPDFBtn) {
  exportPDFBtn.addEventListener("click", () => {
    const element = document.getElementById("captureArea");

    element.classList.add("pdf-mode");

    const opt = {
      margin: 0,
      filename: "checklist.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 10,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        element.classList.remove("pdf-mode");
      });
  });
}




document.querySelectorAll(".imageInput").forEach(input => {
  input.addEventListener("change", function () {
    const file = this.files[0];
    const uploadBox = this.closest(".upload");
    const preview = uploadBox.querySelector(".preview");

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
      };

      reader.readAsDataURL(file);


      uploadBox.classList.add("has-file");
    }
  });
});
