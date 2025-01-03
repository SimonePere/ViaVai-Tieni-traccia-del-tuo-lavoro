import express from 'express';
import { getTrasporti, createTrasporto, getTrasportoById, editTrasportoById, deleteTrasportoById } from '../controllers/trasporti.js';


const router=express.Router();


//GET tutti i trasporti
router.get("/", getTrasporti)
// creaTrasporto
router.post("/", createTrasporto)
//GET un trasporto per id
router.get("/:id",getTrasportoById )
// modificaTrasporto
router.patch("/:id", editTrasportoById)
// cancellaTrasporto
router.delete("/:id", deleteTrasportoById)




export default router;