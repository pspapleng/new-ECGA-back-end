const { Router } = require("express");
const { isLoggedIn } = require("../middlewares");

const {
  getAllAns,
  getAnsByUid,
  getAnsByResultid,
  createAns,
  getLatestAnsByUid,
} = require("../controllers/ans.controller");
const ansRoute = Router();

ansRoute.get("/", isLoggedIn, getAllAns); //ข้อมูลทั้งหมดในตาราง form_ans
ansRoute.get("/user/:id", isLoggedIn, getAnsByUid); //ข้อมูลจากตาราง form_ans ที่มี u_id = id
ansRoute.get("/:id", isLoggedIn, getAnsByResultid); //ข้อมูลจากตาราง form_ans ที่มี result_id = id
ansRoute.post("/", isLoggedIn, createAns);
ansRoute.get("/latest/:id", isLoggedIn, getLatestAnsByUid); //ข้อมูลล่าสุดจากตาราง form_ans ที่มี u_id = id

module.exports = ansRoute;
