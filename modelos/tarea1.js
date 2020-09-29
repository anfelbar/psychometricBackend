const mongoose = require("mongoose");

const tarea1 = new mongoose.Schema({
  idStudiante: {
    type: String,
    required: true,
  },
  tiempoNormal: {
    type: Number,
    required: false,
  },
  erroresNormal: {
    type: Number,
    required: false,
  },
  datosNormal: {
    type: [Boolean],
    required: false,
  },
  tiempoReaccionNormal: {
    type: [Number],
    required: false,
  },
  tiempoInvertido: {
    type: Number,
    required: false,
  },
  erroresInvertido: {
    type: Number,
    required: false,
  },
  datosInvertido: {
    type: [Boolean],
    required: false,
  },
  tiempoReaccionInvertido: {
    type: [Number],
    required: false,
  },
  proporcionAciertos: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Tarea1", tarea1);
