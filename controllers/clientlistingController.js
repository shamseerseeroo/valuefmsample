require('express-async-errors');

const modelService = require('../services/modelService');
const dotenv = require('dotenv');
const clientlistingModel = require('../models/clientlistingModel');
const commonMethods = require('../utilities/common');
const clientlistingService = new modelService(clientlistingModel);
const upload = require('../middleware/clientlistingupload');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require("sharp")
const config = require('../config/config');

exports.create = async (req, res, next) => {
  console.log("hiii")
  console.log(req.body)
  res.data = await clientlistingService.create({
    name: req.body.name,
    description: req.body.description,
    Image: req.file.filename,
    sortorder: req.body.sortorder,
    status: req.body.status,
    createdby: req.body.userId,
    status: req.body.status
  });
  console.log(req.body);
  console.log(res.data)
  if (res.data) {
    try {
      sharp(req.file.path).resize(200, 200).toFile('uploads/clientlisting/thumbs/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
        if (err) {
          console.log(err);
        } else {
          console.log(resizeImage);
        }
      })
      return res.status(201).json({
        status: "success",
        message: "clientlisting retrieved successfully",
        data: res.data
      });
    } catch (error) {
      console.error(error);
    }
    return next();
  }
  debug('Error occured while saving  data');
  throw new Error();
}
exports.updateclientlisting = async (req, res, next) => {
  clientlistingModel.findById(req.params.id, (err, updateItem) => {

    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      if (req.file) {
        const path = './uploads/clientlisting/' + updateItem.Image

        try {
          fs.unlinkSync(path)
          //file removed
        } catch (err) {
          console.error(err)
        }
      }

      updateItem.name = req.body.name;
      updateItem.description = req.body.description;
      updateItem.updateddate = new Date();
      if (req.file) {
        updateItem.Image = req.file.filename
      }
      updateItem.sortorder = req.body.sortorder;
      updateItem.status = req.body.status
      updateItem.createdby = req.body.userId

      updateItem.save((err) => {

        if (err) {
          res.json({
            status: "error",
            message: err,
          });
        } else {
          res.json({
            status: "success",
            message: 'Updated Successfully',
            data: updateItem
          });
        }

      });
    }

  });
}
exports.deleteclientlisting = async (req, res, next) => {
  console.log(req.params.id)
  const data = await clientlistingModel.findById(req.params.id, function (err, ditItem) {
    if (!ditItem) {
      res.json({
        status: "error",
        message: "no record find with the given id"
      });
    }

    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    ditItem.delstatus = true;
    ditItem.save(function (err) {

      if (err) {
        res.json({
          status: "error",
          message: err
        });
      } else {
        res.json({
          status: "success",
          message: 'Deleted Successfully',
          data: ditItem
        });
      }

    });
  })
}
// exports.getpage = async (req, res, next) => {
//   const filterResponse = await commonMethods.filterResponse(req.query);

//   const serviceRes = await Service.getAll(filterResponse);
//   const totalCount = await Service.totalCount();
//   if (serviceRes) {

//       const response = {
//         count: totalCount,
//         data: pageRes,
//       };
//       res.data = response;

//       return next();
//     } else {
//       debug('Error occured while fetching all pages');
//       throw new Error();
//     }
//   }
exports.getclientlistingbyid = async (req, res, next) => {
  const clientlistingdata = await clientlistingModel.findOne({ _id: req.params.id }, (err, result) => {
                                                                                  
    result.Image = "http://localhost:3000/uploads/clientlisting/" + result.Image
    console.log(result.Image)
    console.log(result)
    if (err) {
      consosle.log(err)
      res.json({
        status: "error",
        message: err,
      });
    } else {
      res.json({
        status: "success",
        message: 'clientlisting details loading..',
        data: result
      });
    }
  })
}
exports.getclientlisting = async (req, res, next) => {
  clientlistingModel.find({
    delstatus: false
}).sort({
    sortorder: 1
})
.then(function (list) {
  for(i=0;i<list.length;i++){
    list[i].Image="http://localhost:3000/uploads/clientlisting/" + list[i].Image
   }
    res.json({
        status: "success",
        message: "testimonial retrieved successfully",
        data: list
    });
})
.catch((err) => {
    res.json({
        status: "error",
        message: err,
    });
})
}
exports.getclientlistingstatus= async (req,res, next)=>{
  console.log("status")
  clientlistingModel.find({
    status: true
}).sort({
    sortorder: 1
})
.then(function (list) {
   console.log(list)
   list.filter(data=>{
    data.Image = config.api.BASE_URL+ "uploads/clientlisting/" + data.Image;
    })
    res.json({
        status: "success",
        message: "testimonial retrieved successfully",
        data: list
    });
})
.catch((err) => {
    res.json({
        status: "error",
        message: err,
    });
})
}