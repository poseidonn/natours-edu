const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Dosya bulunamadı' + err);
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Dosya bulunamadı' + err);
      resolve('Oldu');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePromise('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);

    throw err;
  }
  return '2: READY 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log('ERROR 💥');
  }
})();

const getDocPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed : ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message);
    console.log('Yazıldı');
  } catch (err) {
    console.log('olmadı gülüm ' + err);
  }
};

getDocPic();

/* readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body);

    return writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message);
  })
  .then(() => {
    console.log('dosyaya yazıldı');
  })
  .catch((err) => {
    console.log(err.message);
  }); */

/// THEN - CATCH
/* readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body);

    fs.writeFile(`dog-img.txt`, res.body.message, (err) => {
      if (err) return console.log(err.message);
      console.log('dosyaya kaydedildi');
    });
  })
  .catch((err) => {
    console.log(err.message);
  }); */

//// Then then
/* readFilePromise(`${__dirname}/dog.txt`).then((data) => {
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body);

      fs.writeFile(`dog-img.txt`, res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log('dosyaya kaydedildi');
      });
    });
}); */

//// Callback
/* fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body);

      fs.writeFile(`dog-img.txt`, res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log('Hata');
      });
    });
}); */
