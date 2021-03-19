const express = require("express");
const router = express.Router();
const Procurement = require("./../models/Procurement");
const Vendor = require("./../models/Vendor");
router.post("/",async (req, res) => {
        const { name,email, password,type } = req.body;
        
        try {
            if(type==="Procurement")
            {
                procurement = new Procurement({
                    name,
                    email,
                    password
                });
                await procurement.save();
                res.send(procurement._id)
            }
            else if(type==="Vendor")
            {
                const vendor = new Vendor({
                    name,
                    email,
                    password
                });
                await vendor.save();
                res.send(vendor._id)
            }            
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error!");
        }
        }
  );
  module.exports = router;