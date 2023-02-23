const fs = require("fs");

fs.writeFileSync("./Year360Date.js",
    fs.readFileSync(
        "./Year360Date.cjs", {encoding:"utf8", flag:"r"}
    ).replace(
        'require("assert")',
        "(condition, message) => {\n" +
        "    if (!condition) {\n" +
        "        throw new Error(message);\n" +
        "    }\n" +
        "}"
    ).replace(
        "class Year360Date {",
        "export default class Year360Date {"
    ).replace(
        "module.exports = Year360Date;",
        ""
    )
);
