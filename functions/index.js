const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')

const app = express()

admin.initializeApp({
  credential: admin.credential.cert('./permissions.json'),
  databaseURL:''
})
const db = admin.firestore()

app.get('/hello', (req,res) => {
  return res.status(200).json({message: 'hell world'})
})

app.post('/api', async (req, res) => {
  try {
    await db.collection('products').doc('/' + req.body.id + '/').create({name: req.body.name})
    return res.status(200).json()
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.get('/api/:id', (req,res) => {
 
  (async () => {
    try {
      const doc = db.collection('products').doc(req.params.id)
      const name = await doc.get()
      const response = name.data()
      return res.status(200).json(response)
    } catch (error) {
      return res.status(500).send(error)
    }
  })();

})

app.get('/api', async (req, res) => {
  try {
    const query = db.collection('products')
    const querySnapshot = await query.get()
    const docs =  querySnapshot.docs

    const response = docs.map(doc => ({
      id: doc.id,
      nome: doc.data().name
    }))
  
    return res.status(200).json(response)
  } catch (error) {
    return res.status(500).send(error)
  }
})

app.delete('/api/:id_delete', async (req, res) => {
  try {
    const conect = db.collection('products').doc(req.params.id_delete)
    await conect.delete()

    return res.status(200).json();
  } catch (error) {
    return res.status(500).json();
  }
})

app.put('/api/:put_id', async (req, res) => {
  try {
    const dbupt = db.collection('products').doc(req.params.put_id)
    await dbupt.update({
      name: req.body.name
    })
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
})


exports.app = functions.https.onRequest(app)

