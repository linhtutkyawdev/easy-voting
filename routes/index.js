const express = require("express");
const router = express.Router();
const indexController = require("../controller/indexController");
const { voteAuth } = require("../middleware/user-auth");

router.get("/", indexController.index);

router.get("/login", indexController.login);

router.post("/login", indexController.loadLogin);

router.get("/logout", indexController.userLogout);

router.get("/forget-password", indexController.forgetPassword);

router.post("/forget-password", indexController.loadForgetPassword);

router.get("/reset-password", indexController.resetPassword);

router.post("/reset-password", indexController.loadResetPassword);

router.get("/change-password/:id", indexController.changePassword);

router.post("/change-password/:id", indexController.loadChangePassword);

router.get("/sign-up", indexController.signUp);

router.post("/sign-up", indexController.loadSignUp);

router.get("/verify-login", indexController.verifyLogin);

router.post("/verify-login", indexController.loadVerifyLogin);

router.get("/campaign-list", indexController.campaignList);

router.get("/vote-result", indexController.voteResult);

router.get("/campaign-detail/:id", indexController.campaignDetail);

router.post("/give-vote", indexController.voteGive);

router.get("/final-camp", indexController.finalCamp);

router.get("/result-detail/:id", indexController.resultDetail);

router.get("/about", indexController.about);

module.exports = router;
