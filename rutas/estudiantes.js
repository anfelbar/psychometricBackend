//let mongoose = require('mongoose')
const express = require("express");
const router = express.Router();
const Estudiante = require("../modelos/estudiante");
const Tarea1 = require("../modelos/tarea1");
let estudiante = require("../modelos/estudiante");

//Obtener todos los estudiantes en la BD
router.get("/", async (req, res) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getEstudiante, (req, res) => {
  res.json(res.estudiante);
});

//Obtener todos los estudiantes en la BD
router.post("/misEstudiantes/", async (req, res) => {
  // console.log("Instructor ", req.body);
  try {
    await Estudiante.find().then((estudiante) => {
      let salida = [];
      if (estudiante == null) {
        return res.status(404).json({ message: "No existe ningun estudiante" });
      } else {
        estudiante.forEach((element) => {
          //console.log("Element : ",element);
          if (element.datos.instructor === req.body.instructor) {
            // console.log('Estudiante mio: ',element.datos.nombres);
            salida.push(element);
          }
        });
        res.json(salida);
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


function getSum(
  acum,
  item
) {
  if (!item) {
    return 1 + acum;
  } else {
    return 0 + acum;
  }
}

router.post('/getStudentResults/', async (req, res, next) => {
  // console.log('getStudentsR: ', JSON.stringify(req.body));
  const actividad = req.body.actividad;
  if (actividad == "tarea1") {
    try {
      await Tarea1.find({idStudiante:req.body.studentId}).then((tarea) => {
        let salida = [];
        if (tarea == null) {
          return res.status(404).json({ message: "No existe ninguna tarea resuelta" });
        } else {
          tarea.forEach((element) => {
            //console.log("Element : ",element);
            //if (element.codigo === req.body.codigo) {
              // console.log('Estudiante mio: ',element.datos.nombres);
              salida.push(element);
            //}
          });
          // console.log(JSON.stringify(salida));
          res.json(salida);
        }
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
});

//Adicionar resultados a estudiante
router.post("/addStudentResults/", async (req, res, next) => {
  // console.log("addStudentResults ", req.body);
  const actividad = req.body.actividad;
  if (actividad == "tarea1") {
    //console.log("Creando json tarea1");
    const erroresNormally = req.body.datosNormal.reduce(getSum, 0);
    const erroresInverted = req.body.datosInvertido.reduce(getSum, 0);    
    //console.log("Errores totales N: ", erroresNormally);
    //console.log("Errores totales I: ", erroresInverted);
    const resultado = {
      idStudiante: req.body.codigo,
      tiempoNormal: req.body.tiempoNormal,
      erroresNormal: erroresNormally,
      datosNormal: req.body.datosNormal,
      tiempoReaccionNormal: req.body.tiempoReaccionNormal,
      tiempoInvertido: req.body.tiempoInvertido,
      erroresInvertido: erroresInverted,
      datosInvertido: req.body.datosInvertido,
      tiempoReaccionInvertido: req.body.tiempoReaccionInvertido,
      proporcionAciertos: req.body.proporcionAciertos,

    };
    const tarea1 = new Tarea1(resultado);
    const nuevaTarea = await tarea1.save();
    console.log("Nuevo resultado!");
    res.status(201).json(nuevaTarea);
    try {
    } catch (err) {}
  } else if (actividad == "tarea2") {
    console.log("Creando json tarea2");
  }

  /*if (estudianteAdd == null) {
      return res.status(404).json({ message: 'No existe el estudiante' })
    }
    
    //console.log("El estudiante: ",JSON.stringify(estudianteAdd));
    res.json({message: 'It works! '});
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }*/
});

//Registrar un estudiante
router.post("/", async (req, res) => {
  //console.log('Nuevo estudiante : %j!', req.body)
  const estudiante = new Estudiante({
    datos: {
      nombres: req.body.datos.nombres,
      apellidos: req.body.datos.apellidos,
      codigo: req.body.datos.codigo,
      nacimiento: req.body.datos.nacimiento,
      institucion: req.body.datos.institucion,
      pais: req.body.datos.pais,
      ciudad: req.body.datos.ciudad,
      instructor: req.body.datos.instructor,
    },
  });

  try {
    const nuevoEstudiante = await estudiante.save();
    console.log("Nuevo estudiante adicionado!");
    res.status(201).json(nuevoEstudiante);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", getEstudiante, async (req, res) => {
  if (req.body.datos.nombres != null) {
    res.estudiante.datos.nombres = req.body.datos.nombres;
  }

  if (req.body.datos.apellidos != null) {
    res.estudiante.datos.apellidos = req.body.datos.apellidos;
  }
  try {
    const actualizado = await res.estudiante.save();
    res.json(actualizado);
  } catch {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getEstudiante, async (req, res) => {
  try {
    await res.estudiante.remove();
    res.json({ message: "Estudiante eliminado" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEstudiante(req, res, next) {
  try {
    estudiante = await Estudiante.findById(req.params.id);
    if (estudiante == null) {
      return res.status(404).json({ message: "No existe el estudiante" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.estudiante = estudiante;
  next();
}

module.exports = router;
