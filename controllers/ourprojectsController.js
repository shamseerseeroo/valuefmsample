require('express-async-errors');
const modelService = require('../services/modelService');
const dotenv = require('dotenv');
const Ourprojects = require('../models/ourprojectsModel');
const commonMethods = require('../utilities/common');
const ourprojectsService = new modelService(Ourprojects);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const sharp= require("sharp")
const config = require('../config/config');

exports.create = async (req, res, next) => {
  console.log("hu");
  res.data = await ourprojectsService.create({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    Image: req.file.filename,
    sortorder: req.body.sortorder,
    status:req.body.status
  });
  if (res.data) {
    try {
      sharp(req.file.path).resize(200, 200).toFile('uploads/ourprojects/thumbs/' + 'thumbnails-' + req.file.originalname, (err, resizeImage) => {
          if (err) {
              console.log(err);
          } else {
              console.log(resizeImage);
          }
      })
      return res.status(201).json({
        status: "success",
        message: "ourprojects retrieved successfully",
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
exports.updateourprojects = async (req, res, next) => {
    Ourprojects.findById(req.params.id, (err, updateItem) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
        if(req.file){
          
            const path = './uploads/ourprojects/'+updateItem.Image
    
            try {
              fs.unlinkSync(path)
              //file removed
            } catch(err) {
              console.error(err)
            }
          }
      updateItem.title = req.body.title;
      updateItem.description = req.body.description;
      if(req.file){
        updateItem.Image = req.file.filename
      }   
      updateItem.sortorder = req.body.sortorder
      updateItem.content = req.body.content
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

  }
  )
}
exports.deleteourprojects = async (req, res, next) => {
  console.log(req.params.id)
  const data = await Ourprojects.findById(req.params.id, function (err, ditItem) {
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
exports.getourprojects = (req, res) => {
  Ourprojects.find({
            delstatus: false
        }).sort({
            sortorder: 1
        })
        .then(function (list) {
          for(i=0;i<list.length;i++){
            list[i].Image="http://localhost:3000/uploads/ourprojects/" + list[i].Image
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
  };
exports.getourprojectsbyid = async (req, res, next) => {
  const ourteamdata = await Ourprojects.findOne({ _id: req.params.id }, (err, result) => {

    console.log(result.Image)
    console.log(result.Image)
    result.Image = "http://localhost:3000/uploads/ourprojects/" + result.Image
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
        message: 'our projects details loading..',
        data: result
      });
    }
  })
}       
exports.getourprojectsstatus= async (req,res, next)=>{
  Ourprojects.find({
    status: true
}).sort({
    sortorder: 1
})
.then(function (list) {
  list.filter(data=>{
    data.Image = config.api.BASE_URL+ "uploads/ourprojects/" + data.Image;
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