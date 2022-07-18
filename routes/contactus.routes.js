


const express = require('express');
const router = express.Router();
const contactusController = require('../controllers/contactusController');
const middlewareResponse = require('../middleware/response');



/**
 * @swagger
 * definitions:
 *   contactus:
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       address:
 *         type: string
 *       email:
 *         type: string
 *       phonenumber:
 *         type: string
 *       quote:
 *         type: string
 *       mapcordinates:
 *         type: Array       
 *        
 */
//create
router.post('/', contactusController.create,middlewareResponse.saveResponse);
/**
 * @swagger
 * /api/v1/contactus:
 *   post:
 *     tags:
 *       - contactus
 *     description: Creates a new contactus
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Auth
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/contactus'
 *     responses:
 *       200:
 *         description: Successfully created
 */
//update
router.put('/:id',contactusController.updatecontactus, middlewareResponse.updateResponse);
  /**
 * @swagger
 * /api/v1/contactus/{id}: 
 *   put:
 *     tags:
 *       - contactus
 *     description: Creates a new contactus
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: contactus id to Update
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Updated contactus object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/contactus'
 *     responses:
 *       200:
 *         description: Successfully created
 */
router.delete('/:id', contactusController.deletecontactus, middlewareResponse.deleteResponse);
  /**
 * @swagger
 * /api/v1/contactus/{id}: 
 *   delete:
 *     tags:
 *       - contactus
 *     summary: Deletes a contactus
 *     description: ''
 *     operationId: deletecontactus
 *     produces:
 *       - application/xml
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: contactus id to delete
 *         required: true
 *         type: string
 *     responses:
 *       '400':
 *         description: Invalid ID supplied
 *       '404':
 *         description: contactus not found   
 * 
 */  
router.get('/',contactusController.getcontactus, middlewareResponse.getByIdResponse);
/**
 * @swagger
 * /api/v1/contactus:
 *   get:
 *     tags:
 *       - contactus
 *     description: Returns all contactus
 *     produces:
 *       - application/json
 *     parameters: []
 *     responses:
 *       200:
 *         description: An array of contactus       
 *         schema:
 *           $ref: '#/definitions/contactus'
 *       400:
 *         description: Invalid status value 
 */
router.get('/:id',contactusController.getcontactusbyid);
/**
* @swagger
* /api/v1/contactusController/{id}: 
*   get:
*     tags:
*       - contactus
*     description: get a single contactus
*     produces:
*        - application/json
*     parameters:
*       - name: id
*         in: path
*         description: contactus id to view
*         required: true
*         type: string
*     responses:
*       200:
*         description: successful operation
*         schema:
*           $ref: '#/definitions/contactus' 
*       400:
*          description: Invalid ID supplied
*       404:
*         description: contactus not found
*/ 
router.get('/list/status/',  contactusController.getcontactusstatus, middlewareResponse.getByIdResponse);
/**
 * @swagger
 * /api/v1/contactus/list/status/:
 *   get:
 *     tags:
 *       - contactus
 *     description: Returns status contactus
 *     produces:
 *       - application/json
 *     parameters: []
 *     responses:
 *       200:
 *         description: An array of contactus       
 *         schema:
 *           $ref: '#/definitions/contactus'
 *       400:
 *         description: Invalid status value 
 */

module.exports=router;