const { Router } = require("express");
const {
  getAllAns,
  getAnsByUid,
  createAns,
  getLatestAnsByUid,
} = require("../controllers/ans.controller");
const ansRoute = Router();

ansRoute.get("/", getAllAns); //ข้อมูลทั้งหมดในตาราง form_ans
ansRoute.get("/:id", getAnsByUid); //ข้อมูลจากตาราง form_ans ที่มี u_id = id
ansRoute.post("/", createAns);
ansRoute.get("/latest/:id", getAnsByUid); //ข้อมูลล่าสุดจากตาราง form_ans ที่มี u_id = id

module.exports = ansRoute;
