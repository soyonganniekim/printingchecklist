// ===== 언어 토글 =====
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

// ===== 다크모드 =====
const darkToggle = document.getElementById("darkToggle");

if (darkToggle) {
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// ===== 체크박스 =====
document.querySelectorAll(".check-box input").forEach(input => {
  input.addEventListener("change", () => {
    input.parentElement.classList.toggle("checked", input.checked);
  });
});

// ===== 이미지 미리보기 =====
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

// ===== JPG =====
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

// ===== PDF =====
const exportPDFBtn = document.getElementById("exportPDF");

if (exportPDFBtn) {
  exportPDFBtn.addEventListener("click", async () => {
    const area = document.getElementById("captureArea");

    document.body.classList.add("exporting-pdf");

    const canvas = await html2canvas(area, {
      scale: 2,
      backgroundColor: "#ffffff"
    });

    document.body.classList.remove("exporting-pdf");

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;
    const marginY = 18;

    const imgWidth = pageWidth;

    // 첫 페이지는 전체 높이 기준
    const usableHeight = pageHeight - marginY * 2;
    const sliceHeight = canvas.width * (usableHeight / imgWidth);

    let y = 0;
    let pageIndex = 0;

    while (y < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      const ctx = pageCanvas.getContext("2d");

      const currentSliceHeight = Math.min(sliceHeight, canvas.height - y);

      pageCanvas.width = canvas.width;
      pageCanvas.height = currentSliceHeight;

      // 흰 배경 깔기 (선 방지)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

      ctx.drawImage(
        canvas,
        0,
        y,
        canvas.width,
        currentSliceHeight,
        0,
        0,
        canvas.width,
        currentSliceHeight
      );

      const imgData = pageCanvas.toDataURL("image/png");

      if (pageIndex > 0) pdf.addPage();

      const imgHeight = (currentSliceHeight * imgWidth) / canvas.width;

      // ⭐ 핵심: 첫 페이지만 여백 없음
      const yPos = pageIndex === 0 ? 0 : marginY;

      pdf.addImage(imgData, "PNG", 0, yPos, imgWidth, imgHeight);

      y += sliceHeight;
      pageIndex++;
    }

    pdf.save("checklist.pdf");
  });
}