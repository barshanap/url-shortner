const db = require("../models");
const Op = db.Sequelize.Op;
const validUrl = require('valid-url')
const { nanoid } = require('nanoid')
const baseUrl = process.env.SITE_URL + '/tiny'
const {
  forEach
} = require('p-iteration');
const urlMaster = db.urlMaster;
const tagMaster = db.tagMaster;
const urlTagDetails = db.urlTagDetails;

// Create and Save a shorten URL
exports.create = async (req, res) => {
  let url_info = req.body;
  let transactionProcess;
  // Validate request
  if (!url_info.url || !url_info.tags) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  //check base url
  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json('Invalid base URL')
  }
  if (!validUrl.isUri(url_info.url)) {
    return res.status(401).json('Invalid longUrl')
  }
  // create url code
  const urlCode = await nanoid()
  try {
    transactionProcess = await urlTagDetails.sequelize.transaction(); //get transaction
    let url_id;
    let message
    //check main full url on DB
    let url = await urlMaster.findOne({
      where: {
        full_url: url_info.url,
      },
    })
    if (url) {
      url_id = url.id
    } else {
      const shortUrl = baseUrl + '/' + urlCode
      let url_main = {
        short_url: shortUrl,
        full_url: url_info.url,
        url_code: urlCode
      }
      let urlsSaveData = await urlMaster.build(url_main).save({ transaction: transactionProcess });
      url_id = urlsSaveData.id
    }

    await forEach(url_info.tags, async (element) => {
      let tag_id;
      let tags = {
        tag_name: element
      };

      let checkIsExistE = await tagMaster.findOne({
        where: {
          tag_name: element
        }
      });
      if (!checkIsExistE) {
        let tagSaveData = await tagMaster.build(tags).save({ transaction: transactionProcess })
        tag_id = tagSaveData.id
      } else {
        tag_id = checkIsExistE.id
      }
      let tagsDetails = {
        url_id: url_id,
        tag_id: tag_id
      };
      let checkTagUrlExists = await urlTagDetails.findOne({
        where: {
          url_id: url_id,
          tag_id: tag_id
        }
      });
      if (!checkTagUrlExists) {
        let urlTags = await urlTagDetails.build(tagsDetails).save({ transaction: transactionProcess })
        message = 'Created'
      } else {
        message = 'Already Updated'
      }
    });

    let commited = await transactionProcess.commit();
    return res.status(201).json({ "statusCode": 201, "message": message })
  }
  catch (exception) {
    console.log("EXCEPTION----", exception)
    let rollback = await transactionProcess.rollback();
    if (rollback) {
      return res.status(500).json('Server Error')
    }
  }
};

// Retrieve all Urls and Search from the database.
exports.findAll = async (req, res) => {
  let search = req.query.tag || 0
  if (!search) {
    let findUrls = await tagMaster.sequelize.query(
      "select DISTINCT url_id,short_url from url_tag_details JOIN url_master ON url_tag_details.url_id = url_master.id ORDER BY 1", {
      type: tagMaster.sequelize.QueryTypes.SELECT
    });
    let data;
    let main_urls = []
    await forEach(findUrls, async (element) => {
      let tags = []
      let findTags = await tagMaster.sequelize.query(
        `select url_id, tag_name, tag_id from url_tag_details JOIN tag_master ON url_tag_details.tag_id = tag_master.id where url_id=` + element.url_id, {
        type: tagMaster.sequelize.QueryTypes.SELECT
      });
      findTags.forEach(element => tags.push(element.tag_name));
      main_urls.push({
        tags: tags,
        url: element.short_url,
      });
    });
    res.send(main_urls);
  }
  else {
    let findUrls = await tagMaster.sequelize.query(
      `select url_id,short_url from url_tag_details JOIN tag_master ON url_tag_details.tag_id = tag_master.id JOIN url_master ON url_tag_details.url_id = url_master.id where tag_name = '` + search + `'`, {
      type: tagMaster.sequelize.QueryTypes.SELECT
    });
    let data;
    let main_urls = []
    await forEach(findUrls, async (element) => {
      let tags = []
      let findTags = await tagMaster.sequelize.query(
        `select url_id, tag_name, tag_id from url_tag_details JOIN tag_master ON url_tag_details.tag_id = tag_master.id where url_id=` + element.url_id, {
        type: tagMaster.sequelize.QueryTypes.SELECT
      });
      findTags.forEach(element => tags.push(element.tag_name));
      main_urls.push({
        tags: tags,
        url: element.short_url,

      });
    });
    res.send(main_urls);
  }
};

// Recting Short URL to Main URLs
exports.reDirectsUrl = async (req, res) => {
  try {
    const url = await urlMaster.findOne({
      where: {
        url_code: req.params.urlcode
      }
    }
    )
    if (url) {
      return res.redirect(url.full_url)
    }
    else {
      return res.status(404).json('No URL Found')
    }
  }
  catch (err) {
    console.error(err)
    res.status(500).json('Server Error')
  }
};


