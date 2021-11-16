const cheerio = require("cheerio");
const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// var stringify = require("csv-stringify");
const ObjectsToCsv = require("objects-to-csv");

let siteName = "CSV Dataset - bom.gov";
const tags = new Array();

const startPage = 2;
const endPage = 3;

try {
  const getResults = async () => {
    for (let page = startPage; page < endPage; page++) {
      console.log("in maiansdasmaldmammlakam-dlka  ==========>")
      await fetchCSVData(page).then(($) => {
        console.log("Scrapped CSV Count: " + tags.length);
         parseCSVData($);        
        
      }).catch((err) => {
        console.log(err)
      });
    }
    return {
      siteName,
      tags: [...tags].sort(),
    };
  }

  const fetchCSVData = async (page) => {
   
    const siteUrl =  `http://www.bom.gov.au/climate/dwo/IDCJDW4043.latest.shtml`;
    // const siteUrl = `https://catalog.data.gov/dataset?page=${page}`;
    return await axios
    .get(siteUrl)
    .then(({ data }) => {
      return cheerio.load(data);
    })
    .catch((error) => console.log(error.response));
  };
  
  const parseCSVData =async ($) => {
    
    $("a").each(async (_, element) => {
      let href = element.attribs.href;
      console.log(href,'-------------------===--==')
      const length = href.length;
      // const csv =1
      const csv = href.substr(length - 4, length - 1) === ".csv";
      if (csv) {
        tags.push('http://www.bom.gov.au'+href);
        await axios.get('http://www.bom.gov.au'+href).then((res) => {
          const csv = new ObjectsToCsv([{ csv:res.data }]);
          csv.toDisk(`${__dirname}/csvFiles/${Date.now()}.csv`)

        }).catch((error) => {
          console.log(error)
        });
        
      } 
    });
  };
  
  module.exports = getResults;
} catch (error) {
  console.error(error);
}

