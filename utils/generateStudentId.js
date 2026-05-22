const generateStudentId = () => {

    const randomNumber =
        Math.floor(100000 + Math.random() * 900000);

    return `SDPIT${randomNumber}`;

};

module.exports = generateStudentId;