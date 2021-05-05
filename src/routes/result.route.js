const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const {
  getAllResult,
  getResultByUid,
  getResultByResultid,
  createResult,
  getLatestResultByUid,
} = require("../controllers/result.controller");
const resultRoute = Router();

resultRoute.get("/", isLoggedIn, getAllResult); //ข้อมูลทั้งหมดในตาราง form_result
resultRoute.get("/user/:id", isLoggedIn, getResultByUid); //ข้อมูลจากตาราง form_result ที่มี u_id = id
resultRoute.get("/:id", isLoggedIn, getResultByResultid); //ข้อมูลจากตาราง form_result ที่มี result_id = id
resultRoute.post("/", isLoggedIn, createResult);
resultRoute.get("/latest/:id", isLoggedIn, getLatestResultByUid); //ข้อมูลล่าสุดจากตาราง form_result ที่มี u_id = id

module.exports = resultRoute;
