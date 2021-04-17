const { Router } = require("express");
const {
  getAllAns,
  getAns,
  createAns,
} = require("../controllers/ans.controller");
const ansRoute = Router();

ansRoute.get("/", getAllAns); //ข้อมูลทั้งหมดในตาราง form_ans
ansRoute.get("/:id", getAns); //ข้อมูลจากตาราง form_ans ที่มี u_id = id
ansRoute.post("/", createAns);

module.exports = ansRoute;
