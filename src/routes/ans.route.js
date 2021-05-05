const { Router } = require("express");

const {
  getAllAns,
  getAnsByUid,
  getAnsByResultid,
  createAns,
  getLatestAnsByUid,
} = require("../controllers/ans.controller");
const ansRoute = Router();

ansRoute.get("/", getAllAns); //ข้อมูลทั้งหมดในตาราง form_ans
ansRoute.get("/user/:id", getAnsByUid); //ข้อมูลจากตาราง form_ans ที่มี u_id = id
ansRoute.get("/:id", getAnsByResultid); //ข้อมูลจากตาราง form_ans ที่มี result_id = id
ansRoute.post("/", createAns);
ansRoute.get("/latest/:id", getLatestAnsByUid); //ข้อมูลล่าสุดจากตาราง form_ans ที่มี u_id = id

module.exports = ansRoute;
