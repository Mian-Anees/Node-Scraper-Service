const cheerio = require("cheerio");
const axios = require("axios");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
// var fs = require("fs");
// var stringify = require("csv-stringify");
const ObjectsToCsv = require("objects-to-csv");

let siteName = "CSV Dataset - Data.gov";
const tags = new Array();

const startPage = 2;
// const endPage = 10862;
const endPage = 20;

// const downloadCSV = async () => {};
try {
  const fetchCSVData = async (page) => {
    const siteUrl = `https://catalog.data.gov/dataset?page=${page}`;
    return await axios
    .get(siteUrl)
    .then(({ data }) => {
      return cheerio.load(data);
    })
    .catch((error) => console.log(error.response));
  };
  
  const parseCSVData =async ($) => {
    $("a.label").each(async (_, element) => {
      let href = element.attribs.href;
      const length = href.length;
      const csv = href.substr(length - 4, length - 1) === ".csv";
      if (csv) {
        tags.push(href);
        await axios.get(href).then((res) => {
          console.log(res.data);
          const csv = new ObjectsToCsv([{ csv:res.data }]);
          csv.toDisk(`${__dirname}/csvFiles/${Date.now()}.csv`)
        //   console.log(res.data,"in first",__dirname)
        //   //  res.data.createWriteStream(__dirname, { flags: 'wx+' })
        //   const csvWriter = createCsvWriter({
        //     path: `${__dirname}${Date}.csv`,
        //    header: [
        //      { id: "name", title: "Name" },
        //      { id: "surname", title: "Surname" },
        //      { id: "age", title: "Age" },
        //      { id: "gender", title: "Gender" },
        //    ],
        //  });

        //  const data = [
        //    {
        //      name: "John",
        //      surname: "Snow",
        //      age: 26,
        //      gender: "M",
        //    },
        //    {
        //      name: "Clair",
        //      surname: "White",
        //      age: 33,
        //      gender: "F",
        //    },
        //    {
        //      name: "Fancy",
        //      surname: "Brown",
        //      age: 78,
        //      gender: "F",
        //    },
        //  ];

        //  csvWriter
        //    .writeRecords(res.data)
        //    .then(() => console.log("The CSV file was written successfully"));
          
        }).catch((error) => {
          console.log(error)
        });
        
      } 
    });
  };
  
  const getResults = async () => {
    for (let page = startPage; page < endPage; page++) {
      console.log("in maiansdasmaldmammlakam-dlka  ==========>")
      await fetchCSVData(page).then(($) => {
        // console.log("Page: " + page);
        console.log("Scrapped CSV Count: " + tags.length);
         parseCSVData($);        
        
      }).catch((err) => {
        console.log(err)
      });
    }
  //  console.log(this);
    return {
      siteName,
      tags: [...tags].sort(),
    };
  }
  module.exports = getResults;
} catch (error) {
  console.error(error);
}

