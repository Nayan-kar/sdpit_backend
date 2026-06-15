const { createCertificate } = require("../services/certificateService");

const generateCertificate = async (req, res) => {
    try {

        const {
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
        } = req.body;

        const certificate = await createCertificate({
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
        });

        res.status(201).json({
            success: true,
            message: "Certificate generated successfully",
            certificate
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Certificate generation failed"
        });
    }
};

module.exports = {
    generateCertificate
};