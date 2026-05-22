const generateUsername = (fullName) => {

    const randomNumber =
        Math.floor(100 + Math.random() * 900);

    const username = fullName
        .toLowerCase()
        .replace(/\s+/g, "");

    return `${username}${randomNumber}`;

};

module.exports = generateUsername;