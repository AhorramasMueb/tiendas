const express = require('express');
const core = require('http-server/lib/core');
const cors = require('cors')
const Datastore = require('nedb');

const app = express();
app.use(cors())
const port = 3001;

const db = new Datastore({ filename: 'tiendasDB.db', autoload: true });

app.use(express.json());

app.get('/home', (req, res) => {
    res.send("conenectado a server")
});


app.post('/createDoc', (req, res) => {
    const { _id, sucursal, capacidad, n, producto, color, fecha } = req.body
    const data = {
        _id: _id,
        name: sucursal,
        capacidad: capacidad,
        productos: [
           
        ],
    };
    db.insert(data, (err, newDoc) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.json({message:"Sucursal creada."})
        }
    });
});

app.get('/findDocs', (req, res) => {
    db.find({}, function (err, docs) {
        if (err) {
            res.status(500).json({ message: 'Ocurrio un error. Intente de nuevo.' });
            process.exit(0)
        }
        if (docs.length > 0) { res.json(docs) }
        else { res.json([]) }
    })
})

app.get('/findOneDoc/:name', (req, res) => {
    const name = req.params.name
    db.find({ name: name }, function (err, doc) {
        if (err) {
            res.status(500).json({ message: 'Ocurrio un error. Intente de nuevo.' });
            process.exit(0)
        }
        if (doc.length > 0) { res.json(doc) }
        else { res.json([]) }

    })
})

app.get('/countRowsStores/:id', (req, res) => {
    const id = req.params.id
    db.find({ _id: parseInt(id) }, function (err, docs) {
        if (err) {
            res.status(500).json({ message: 'Ocurrio un error. Intente de nuevo.' });
            process.exit(0)
        }
        if (docs.length > 0) { res.json(docs) }
        else { res.json([]) }
    })
})


app.post('/updateDoc', (req, res) => {
    const { _id, n, sucursal, capacidad, producto, color, fecha, status, swi } = req.body;
    const dataProductos = { n: n + 1, nombre: producto, color: color, exibicion: fecha }
    if (swi) {
        db.update({ _id: parseInt(_id) }, { $set: { name: sucursal, capacidad: capacidad } }, {}, function (err, numReplaced) {
            if (err) {
                res.status(500).json({ message: "Error al actualizar sucursal." });
                return;
            }
            if (numReplaced > 0) {
                res.status(200).json({ message: "Sucursal actualizada con éxito." });
            } else {
                res.status(404).json({ message: "Documento no encontrado." });
            }
        });
    } else {
        db.update({ _id: parseInt(_id) }, { $push: { productos: dataProductos } }, {}, function (err, numReplaced) {
            if (err) {
                res.status(500).json({ message: "Error al agregar el producto." });
                return;
            }

            if (numReplaced > 0) {
                res.status(200).json({ message: "Producto agregado con éxito." });
            } else {
                res.status(404).json({ message: "Documento no encontrado." });
            }
        });
    }
})


app.get('/countArray', (req, res) => {
    db.count({}, function (err, count) {
        if (err) {
            res.status(500).send("Error al contar los documentos.");
        } else {
            res.json({ count: count });
        }
    });
});

app.delete('/deleteProducto/:suc/:id', (req, res) => {
    const { suc, id } = req.params
    const update = {
        $pull: { productos: { n: parseInt(id) } }, // Utiliza $pull para eliminar el producto específico
    };
    db.update({ name: suc }, update, {}, function (err, numUpdated) {
        if (err) {
            res.status(500).json({ message: "Intente de nuevo" });
        } else if (numUpdated > 0) {
            res.json({msg:"Producto Eliminado."});
        } else {
            res.send("Producto no encontrado");
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});