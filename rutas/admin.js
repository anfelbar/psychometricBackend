//let mongoose = require('mongoose')
const  express = require('express')
const router = express.Router()
const fireAdmin = require('../firebaseConfig');

const adminSchema = require('../modelos/admin');


 async function listAllUsers(total, nextPageToken) {
  
  // List batch of users, 1000 at a time.
  await fireAdmin.auth().listUsers(1000, nextPageToken)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        //console.log('userUID', userRecord.toJSON().uid);
        //console.log('user', userRecord.toJSON().email);
        const usuario = {
          uid: userRecord.toJSON().uid,
          correo: userRecord.toJSON().email
        };
        total.push(usuario);
      });
      if (listUsersResult.pageToken) {
        // List next batch of users.
        total = listAllUsers(total, listUsersResult.pageToken);
      }
    })
    .catch(function(error) {
      console.log('Error listing users:', error);
    });
    return total;
}

// CREATE question
router.route('/add-admin').post((req, res, next) => {
    adminSchema.create(req.body, (error, data) => {
      if (error) {
          console.log("the data admin was "+req.body);
        return next(error)
      } else {
        console.log(data)
        res.json(data)
      }
    })
  });

  /// list questions
router.route('/').get(async (req, res, next) => { 
  try {
    var sol = [];
    const tot =  await listAllUsers(sol);
    //console.log("Usuarios %j",tot);
    var jsonNuevo = {            
      "admins": tot
  };
    res.json(jsonNuevo);
  }catch (e){
    next(e);
  }
    /*adminSchema.find()
    .then(admins => {
      //console.log("creating json in backend preguntas");
        var jsonNuevo = {            
            "admins": admins
        };
        res.send(jsonNuevo);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error obteniendo admins."
        });
    });*/
  })

  router.route('/autenticar/').post((req, res, next) => { 
    
    const elquees = req.body.usuario;
    const elpassw = req.body.password;
    //console.log("req2: j",elquees);      
    const request = {
      correo : elquees,
      passw: elpassw
    }
    adminSchema.findOne(request)
    .then(resultado => {
      //console.log("resultado es %j", resultado);
      const autenticado = resultado == null ? false : true;      
        var jsonNuevo = {            
            "resultado": autenticado
        };
        res.send(jsonNuevo);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Error obteniendo consulta parametros."
        });
        return next(error);
    });
  })


  // Obtener un administrador
router.route('/edit-admin/:id').get((req, res, next) => {
    //console.log("okay, editing admins %j", req.params);
    adminSchema.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
      }
    })
  })
  
  
  // Actualizar administrador
  router.route('/update-admin/:id').put((req, res, next) => {
    adminSchema.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, (error, data) => {
      if (error) {
        console.log(error)
        return next(error);
        
      } else {
        res.json(data)
        console.log('Quastion updated successfully !')
      }
    })
  })

  router.route('/delete-admin/:id').delete((req, res, next) => {
    adminSchema.findByIdAndRemove(req.params.id, (error, data) => {
      if (error) {
        return next(error);
      } else {
        res.status(200).json({
          msg: data
        })
      }
    })
  })

  module.exports = router;