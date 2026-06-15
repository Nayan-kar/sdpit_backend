const generateCertificateId = () => {
    const year = new Date().getFullYear();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `SDPIT-${year}-${random}`;
};

module.exports = generateCertificateId;