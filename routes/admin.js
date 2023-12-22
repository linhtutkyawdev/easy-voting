var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");
const { adminAuth } = require("../middleware/admin-auth");
const multer = require("multer");
const upload = multer({ dest: "public/images/upload/cover" });
const uploadData = multer({ dest: "public/images/upload/img" });

router.get("/", adminAuth, adminController.dashboard);

router.get("/login", adminController.login);

router.post("/login", adminController.loadLogin);

router.get("/change-password", adminAuth, adminController.changePassword);

router.post("/change-password", adminAuth, adminController.loadChangePassword);

router.get("/logout", adminController.adminLogout);

router.get("/campaign-list", adminAuth, adminController.campaignList);

router.get("/campaign-detail/:id", adminAuth, adminController.campaignDetail);

router.get("/other", adminAuth, adminController.other);

router.get("/project", adminAuth, adminController.project);

router.get("/king-queen", adminAuth, adminController.kingQueen);

router.get("/create", adminAuth, adminController.create);

router.post(
  "/create",
  adminAuth,
  upload.single("image"),
  adminController.loadCreate
);

router.post("/campaign-delete", adminController.campaignDelete);

router.get("/campaign-data/:id", adminAuth, adminController.campaignData);

router.post(
  "/campaign-data/id",
  adminAuth,
  uploadData.single("image"),
  adminController.loadCampaignData
);

router.post("/user-delete", adminController.userDelete);

router.post("/user-acc-delete", adminController.userAccDelete);

router.post("/change-user-status", adminController.userEnable);

router.get("/campaign-update/:id", adminAuth, adminController.campaignUpdate);

router.post(
  "/campaign-update",
  adminAuth,
  upload.single("image"),
  adminController.loadCampaignUpdate
);

router.get(
  "/campaign-data-update/:id",
  adminAuth,
  adminController.campaignDataUpdate
);

router.post(
  "/campaign-data-update",
  adminAuth,
  uploadData.single("image"),
  adminController.loadCampaignDataUpdate
);

router.get("/change-status", adminAuth, adminController.changeStatus);

router.post("/change-status", adminAuth, adminController.loadChangeStatus);

module.exports = router;
