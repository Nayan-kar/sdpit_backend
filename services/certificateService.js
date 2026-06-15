const Certificate = require("../models/Certificate");
const generateCertificateId = require("../utils/generateCertificateId");
const generateCertificatePdf = require("../utils/generateCertificatePdf");

const createCertificate = async ({
    student,
    course,
    assessment,
    studentName,
    guardianName,
    courseName,
    duration,
    grade,
    enrollmentNo,
    courseId
}) => {

    // Check existing certificate
    const existingCertificate = await Certificate.findOne({
        student,
        course
    });

    if (existingCertificate) {
        return existingCertificate;
    }

    // Generate new certificate ID
    const certificateId = generateCertificateId();
    const completionDate = new Date().toLocaleDateString();

    const pdfUrl = await generateCertificatePdf({
        studentName,
        guardianName,
        courseName,
        duration,
        completionDate,
        grade,
        certificateId,
        enrollmentNo,
        courseId
    });
    // Create certificate
    const certificate = await Certificate.create({
        student,
        course,
        assessment,

        certificateId,

        studentName,
        guardianName,
        courseName,

        duration,
        grade,

        enrollmentNo,
        courseId,

        pdfUrl
    });
    return certificate;
};

module.exports = {
    createCertificate
};