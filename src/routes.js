const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const ProductController = require('./app/controllers/ProductController')


routes.get('/', function( req, res ){
    return res.render('layout.njk')
})

routes.get('/products/create', ProductController.create )
routes.get('/products/:id', ProductController.show )
routes.get('/products/:id/edit', ProductController.edit )


routes.post('/products', multer.array('photos', 6), ProductController.post ) 
/*
multer.array(), pq estou recebendo vários files. antes do post(criar) e put(atualizar), ele irá
passar pelo multer.
('photos', 6), ele vai ver que é um array de fotos, e estou limitando a 6.
 'photos' - pq no input em fields.njk tem o mesmo nome: name="photos"
*/
routes.put('/products',  multer.array('photos', 6), ProductController.put )



routes.delete('/products', ProductController.delete )

// Alias = significa atalhos
routes.get('/ads/create', function( req, res ){
    return res.redirect('/products/create')
})

module.exports = routes