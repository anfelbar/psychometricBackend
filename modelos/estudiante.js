const mongoose = require('mongoose')

const estudiante = new mongoose.Schema({
  datos: {
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    codigo: {
        type: Number,
        required: true
    },
    nacimiento: {
        type: String,
        required: true,
        //default: Date.now
    },
    institucion: {
      type: String,
      required: true
    },
    pais: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    instructor: {
      type: String,
      required: true
    }
  }
  
});

module.exports = mongoose.model('Estudiante', estudiante);