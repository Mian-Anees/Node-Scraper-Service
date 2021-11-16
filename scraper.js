const cheerio = require("cheerio");
const axios = require("axios");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// var fs = require("fs");
// var stringify = require("csv-stringify");
// const ObjectsToCsv = require("objects-to-csv");

let siteName = "CSV Dataset - bom.gov";
const tags = new Array();

// const startPage = 2026;
// const endPage = 3000;

try {
  const getResults = async () => {
    // for (let page = startPage; page < endPage; page++) {
    await fetchData()
      .then(($) => {
        parseData($);
      })
      .catch((err) => {
        console.log(err);
      });
    // }
    return {
      siteName,
      tags: [...tags].sort(),
    };
  };

  const fetchData = async () => {
    const siteUrl = `https://gutenberg.org/ebooks/search/?query=genera&submit_search=Go%21`;
    // const siteUrl =  `http://www.bom.gov.au/climate/dwo/IDCJDW${page}.latest.shtml`;
    // const siteUrl = `https://catalog.data.gov/dataset?page=${page}`;
    return await axios
      .get(siteUrl)
      .then(({ data }) => {
        // console.log(data);
        return cheerio.load(data);
      })
      .catch((error) => console.log(error.response));
  };

  const parseData = async ($) => {
    $("a").each(async (_, element) => {
      // console.log(element)
      // let href = element.attribs.href;
      if (element.parent.name == "li") {
          element.parent.children.map((children) => {
            if (children.children) {
              console.log(children.children[0],'+++++++++++++++++++')
              // return children.children[0].children
              // map((res) => {
              //   if (res.name == "span") {
              //     console.log(res,'--------')
              //     // return res.children;
              //   }
              //   return ''
              // });
            }
          })
      }
      // $("ul").each(async (_, elem) => {
      //   console.log(elem);
      // });
      // let title = element.attribs.title;

      // const length = href.length;
      // const csv =1
      // const csv = href.substr(length - 4, length - 1) === ".csv";
      // if (csv) {
      //   tags.push('http://www.bom.gov.au'+href);
      // await axios.get('http://www.bom.gov.au'+href).then((res) => {
      //   const csv = new ObjectsToCsv([{ csv:res.data }]);
      //   csv.toDisk(`${__dirname}/csvFiles/${Date.now()}.csv`)

      // }).catch((error) => {
      //   console.log(error)
      // });

      // }
    });
  };

  module.exports = getResults;
} catch (error) {
  console.error(error);
}
