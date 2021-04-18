const { Router } = require("express");
const {
  getAllResult,
  getResultByUid,
  getResult,
  createResult,
  getLatestResultByUid,
} = require("../controllers/result.controller");
const resultRoute = Router();

resultRoute.get("/", getAllResult); //ข้อมูลทั้งหมดในตาราง form_result
resultRoute.get("/user/:id", getResultByUid); //ข้อมูลจากตาราง form_result ที่มี u_id = id
resultRoute.get("/:id", getResult); //ข้อมูลจากตาราง form_result ที่มี result_id = id
resultRoute.post("/", createResult);
resultRoute.get("/latest/:id", getLatestResultByUid); //ข้อมูลล่าสุดจากตาราง form_result ที่มี u_id = id

module.exports = resultRoute;
