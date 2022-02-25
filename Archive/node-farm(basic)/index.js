const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

///////////////////////////////////////////////////////////////////
/// FILES

// Blocking reading
/* const textIN = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIN);

const textOut = `this is: ${textIN}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut); */

// Non-Blocking asynchronous way

/* fs.readFile("./txt/start.txt", "utf-8", (error, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (error, data2) => {
    console.log(data2);
    error ? console.error(error) : "";
    fs.readFile("./txt/append.txt", "utf-8", (error, data3) => {
      console.log(data3);
      error ? console.error(error) : "";
      fs.writeFile(
        "./txt/final.txt",
        `${data2}\n${data3}`,
        "utf-8",
        (error) => {
          error ? console.error(error) : "";
        }
      );
    });
  });
});

try {
  async function readWrite() {
    const r = await fs.readFile("./txt/start.txt", "utf-8");
  }
} catch (error) {
  console.error(error);
}

console.log(fs);
 */
////////////////////////////////////////////////////////////////////////
//// SERVER
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

console.log(slugify("Fresh Avocados", { lower: true }));

const server = http.createServer((req, res) => {
  console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);
  //const pathName = req.url;

  switch (pathname) {
    case "/overview":
    case "/":
      res.writeHead(200, {
        "Content-type": "text/html",
      });

      const cardsHtml = dataObject
        .map((element) => replaceTemplate(templateCard, element))
        .join("");

      const output = templateOverview.replace("{%productCards%}", cardsHtml);

      res.end(output);
      break;

    case "/product":
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const product = dataObject[query.id];
      console.log(product);
      const outputDetay = replaceTemplate(templateProduct, product);
      res.end(outputDetay);
      break;
    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(data);
      break;
    default:
      res.writeHead(404, {
        "Content-type": "text/html",
        "my-own-header": "hellooooo",
      });
      res.end("<h1>Bulunamadı!</h1>");
  }

  //res.end("Merhaba yapradağım");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("İstek 8000 portundan dinleniyor");
});
