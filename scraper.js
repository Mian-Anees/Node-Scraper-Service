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
    const siteUrl = 'https://gutenberg.org/ebooks/search/?query=funny&submit_search=Go%21'
    // const siteUrl = `https://gutenberg.org/ebooks/search/?query=genera&submit_search=Go%21`;
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
    let booksArray = []
    $("span").each(async (index, element) => {
      if (element.children && element.children[0] && element.children[0].data && element.children[0].data.includes('downloads')) {
        console.log($('ul a')[index].attribs.href, '+++++++++')
        const bookObject = {
          title: $("span")[index - 2].children[0].data,
          auther: $("span")[index - 1].children[0].data,
          downloads: $("span")[index].children[0].data
        }
        booksArray.push(bookObject)
      }

    });
    console.log(booksArray, '----')
  };

  module.exports = getResults;
} catch (error) {
  console.error(error);
}
