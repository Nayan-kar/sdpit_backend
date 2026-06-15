const fs = require("fs");

const path = require("path");

const puppeteer = require("puppeteer");

const generateCertificatePdf = async ({
    studentName,
    guardianName,
    courseName,
    duration,
    grade,
    completionDate,
    certificateId,
    enrollmentNo,
    courseId
}) => {

    // =========================
    // LOAD HTML TEMPLATE
    // =========================

    const templatePath = path.join(

        __dirname,

        "../certificates/templates/certificateTemplate.html"

    );

    let html = fs.readFileSync(
        templatePath,
        "utf8"
    );

    // =========================
    // LOAD BACKGROUND IMAGE
    // =========================

    const imagePath = path.join(

        __dirname,

        "../certificates/templates/certificate-bg.png"

    );

    const imageBase64 = fs.readFileSync(
        imagePath,
        {
            encoding: "base64"
        }
    );

    const imageSrc =
        `data:image/png;base64,${imageBase64}`;

    // =========================
    // REPLACE BACKGROUND
    // =========================

    html = html.replace(
        "{{backgroundImage}}",
        imageSrc
    );

    // =========================
    // REPLACE DYNAMIC DATA
    // =========================

    html = html.replace(
        "{{studentName}}",
        studentName || ""
    );

    html = html.replace(
        "{{guardianName}}",
        guardianName || ""
    );

    html = html.replace(
        "{{courseName}}",
        courseName || ""
    );

    html = html.replace(
        "{{duration}}",
        duration || ""
    );

    html = html.replace(
        "{{grade}}",
        grade || ""
    );

    html = html.replace(
        "{{completionDate}}",
        completionDate || ""
    );

    html = html.replace(
        "{{certificateId}}",
        certificateId || ""
    );

    html = html.replace(
        "{{enrollmentNo}}",
        enrollmentNo || ""
    );

    html = html.replace(
        "{{courseId}}",
        courseId || ""
    );

    // =========================
    // LAUNCH BROWSER
    // =========================

    const browser = await puppeteer.launch({

        headless: true

    });

    const page = await browser.newPage();

    await page.setContent(html, {

        waitUntil: "networkidle0"

    });

    // =========================
    // OUTPUT PATH
    // =========================

    const outputPath = path.join(

        __dirname,

        `../certificates/generated/${certificateId}.pdf`

    );

    // =========================
    // GENERATE PDF
    // =========================

    await page.pdf({

        path: outputPath,

        format: "A4",

        printBackground: true

    });

    // =========================
    // CLOSE BROWSER
    // =========================

    await browser.close();

    // =========================
    // RETURN PDF PATH
    // =========================

    return `/certificates/generated/${certificateId}.pdf`;
};

module.exports = generateCertificatePdf;