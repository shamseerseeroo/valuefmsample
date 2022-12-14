require('express-async-errors');
const modelService = require('../services/modelService');
const dotenv = require('dotenv');
const Contactus = require('../models/contactusModel');
const commonMethods = require('../utilities/common');
const contactusService = new modelService(Contactus);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

exports.create = async (req, res, next) => {
 
  res.data = await contactusService.create({
    title: req.body.title,
    description:req.body.description,
    quote:req.body.quote,
    mapcordinates:req.body.mapcordinates,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    address: req.body.address
  });
  if (res.data) {
   
      return res.status(201).json({
        status: "success",
        message: "contactus retrieved successfully",
        data: res.data
      });
  } else {
    return res.status(400).json({
      status: "error"
    });
  }
}
// exports.create = async (req, res) => {

//   var Contactus = new Contactus();
//   Contactus.email = req.body.email;
//   Contactus.phonenumber = req.body.phonenumber;
//   Contactus.address = req.body.address;

//   Contactus.save((err) => {
//       if (err) {
//           res.json({
//               status: "error",
//               message: err,
//           });
//       } else {
//           res.json({
//               status: "success",
//               message: 'Successfully Created',
//               data: Contactus
//           });
//       }
//   });
// };
exports.updatecontactus = async (req, res, next) => {
  Contactus.findById(req.params.id, (err, updateItem) => {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    } else {
      updateItem.email = req.body.email;
      updateItem.phonenumber = req.body.phonenumber;
      updateItem.title=req.body.title
      updateItem.description=req.body.description
      updateItem.quote=req.body.quote
      updateItem.mapcordinates=req.body.mapcordinates
      updateItem.updateddate = new Date();
      updateItem.address = req.body.address

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
exports.deletecontactus = async (req, res, next) => {
  console.log(req.params.id)
  const data = await Contactus.findById(req.params.id, function (err, ditItem) {
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
exports.getcontactus = async (req, res, next) => {
  const contactusdata = await Contactus.findOne( (err, result) => {

    
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
        message: 'contactus details loading..',
        data: result
      });
    }
  })
}
exports.getcontactusbyid = async (req, res, next) => {
  console.log(req)
  const contactusdata = await Contactus.findOne({_id : req.params.id }, (err, result) => {
    console.log("hiiii")
    
    if (err) {
      console.log("error")
      res.json({        status: "error",
        message: err,
      });
    } else {
      console.log("success");
      res.json({
        status: "success",
        message: 'contact details loading..',
        data: result
      });
    }
  })
}  
exports.getcontactusstatus= async (req,res, next)=>{
  Contactus.find({
    status: true
}).sort({
    sortorder: 1
})
.then(function (list) {
  list.filter(data=>{
    data.Image = config.api.BASE_URL+ "uploads/contactus/" + data.Image;
    })
    const response = Object.assign({}, list);
    res.json({
        status: "success",
        message: "testimonial retrieved successfully",
        data: response
    });
})
.catch((err) => {
    res.json({
        status: "error",
        message: err,
    });
})
}           