const mongoose = require('mongoose');

const Admin = mongoose.Schema({    
    correo: String,
    nombre: String,
    passw: String 
});

module.exports = mongoose.model('Admin', Admin);