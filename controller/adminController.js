require("dotenv").config();
const Admin = require("../model/admin");
const Campaign = require("../model/campaign");
const CampaignData = require("../model/campaignData");
const User = require("../model/user");
const fs = require("fs");
const moment = require("moment");
const cron = require("node-cron");
const EventEmitter = require("events");
const event = new EventEmitter();
// const CronJob = require("node-cron").CronJob;
// var CronJob = require("cron").CronJob;

exports.dashboard = (req, res) => {
  // cron.schedule("* 1 * * *", () => {
  //   console.log("running a task every minute");
  // });

  // console.log("Before job instantiation");
  // let date = 2;
  // date.setSeconds(date.getSeconds() + 2);
  // const job = new CronJob(date, function () {
  //   const d = new Date();
  //   console.log("Specific date:", date, ", onTick at:", d);
  // });
  // console.log("After job instantiation");
  // job.start();

  User.find((err, rtn) => {
    if (err) throw err;
    User.find({ verify: true }, (err5, rtn5) => {
      if (err5) throw err5;
      User.find({ verify: false }, (err4, rtn4) => {
        if (err4) throw err4;
        Campaign.find({ select: "1" }, (err1, rtn1) => {
          if (err1) throw err1;
          Campaign.find({ select: "2" }, (err2, rtn2) => {
            if (err2) throw err2;
            Campaign.find({ select: "3" }, (err3, rtn3) => {
              if (err3) throw err3;
              res.render("admin/dashboard", {
                king: rtn1,
                project: rtn2,
                other: rtn3,
                user: rtn,
                Fuser: rtn4,
                Tuser: rtn5,
              });
            });
          });
        });
      });
    });
  });
};

exports.login = (req, res) => {
  Admin.findOne({ name: "Admin" }, (err, rtn) => {
    if (err) throw err;
    if (rtn == null) {
      const name = "Admin",
        email = "admin@gmail.com",
        password = "admin";
      var admin = new Admin({
        name,
        email,
        password,
      });
      admin.save();
    }
  });
  res.render("admin/login");
};

exports.loadLogin = (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, rtn) => {
    if (err) throw err;
    if (rtn != null && req.body.password == rtn.password) {
      req.session.admin = {
        id: rtn._id,
        name: rtn.name,
        email: rtn.email,
        password: rtn.password,
      };
      res.redirect("/admin");
    } else {
      res.redirect("/admin/login");
    }
  });
};

exports.changePassword = (req, res) => {
  res.render("admin/change-password");
};

exports.loadChangePassword = (req, res) => {
  Admin.findOneAndUpdate(
    { password: req.body.password1 },
    { $set: { password: req.body.password } },
    (err, rtn) => {
      if (err) throw err;
      if (rtn == null) {
        res.redirect("/admin/change-password");
      } else {
        req.session.destroy((err, rtn) => {
          if (err) throw err;
          res.redirect("/admin");
        });
      }
    }
  );
};

exports.campaignList = (req, res) => {
  res.render("admin/campaign-list");
};

exports.campaignDetail = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    CampaignData.find({ campaignId: rtn.id }, (err1, rtn1) => {
      if (err1) throw err1;
      res.render("admin/campaign-detail", { data: rtn, user: rtn1 });
    });
  });
};

exports.adminLogout = (req, res) => {
  req.session.destroy((err, rtn) => {
    if (err) throw err;
    res.redirect("/admin/login");
  });
};

exports.other = (req, res) => {
  Campaign.find({ select: "3" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/other", { data: rtn });
  });
};

exports.project = (req, res) => {
  Campaign.find({ select: "2" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/project", { data: rtn });
  });
};

exports.kingQueen = (req, res) => {
  Campaign.find({ select: "1" }, (err, rtn) => {
    if (err) throw err;
    res.render("admin/king-queen", { data: rtn });
  });
};

exports.create = (req, res) => {
  res.render("admin/create");
};

exports.loadCreate = (req, res) => {
  var campaign = new Campaign();
  campaign.title = req.body.title;
  campaign.description = req.body.description;
  campaign.select = req.body.select;
  campaign.create = moment().format("D MMMM YYYY, h:mm:ss A");
  campaign.endDate = req.body.endDate;
  if (req.file) campaign.image = "/images/upload/cover/" + req.file.filename;
  campaign.save();

  let opt = req.body.select;
  if (opt == "1") {
    res.redirect("/admin/king-queen");
  } else {
    if (opt == "2") {
      res.redirect("/admin/project");
    } else {
      if (opt == "3") {
        res.redirect("/admin/other");
      }
    }
  }
};

exports.campaignDelete = (req, res) => {
  CampaignData.find({ campaignId: req.body.id }, (err1, rtn1) => {
    if (err1) {
      res.json({
        status: "error",
      });
    }
    for (var i = 0; i < rtn1.length; i++) {
      fs.unlink("public" + rtn1[i].image, (err2) => {
        if (err2) {
          res.json({
            status: "error",
          });
        }
      });
    }
    CampaignData.deleteMany({ campaignId: req.body.id }, (err3) => {
      if (err3) {
        res.json({
          status: "error",
        });
      }
    });
  });
  Campaign.findByIdAndDelete(req.body.id, (err, rtn) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      fs.unlink("public" + rtn.image, (err) => {
        if (err) {
          res.json({
            status: "error",
          });
        } else {
          res.json({
            status: true,
          });
        }
      });
    }
  });
};

exports.campaignData = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    res.render("admin/campaign-data", { data: rtn });
  });
};

exports.loadCampaignData = (req, res) => {
  var campaignData = new CampaignData();
  campaignData.name = req.body.name;
  campaignData.campaignId = req.body.id;
  campaignData.description = req.body.desc;
  campaignData.uploadDate = moment().format("D MMMM YYYY, h:mm:ss A");
  if (req.file) campaignData.image = "/images/upload/img/" + req.file.filename;
  campaignData.save();
  Campaign.findById(req.body.id, (err, rtn) => {
    if (rtn.id == req.body.id) {
      res.redirect("/admin/campaign-detail/" + req.body.id);
    }
  });
};

exports.userDelete = (req, res) => {
  CampaignData.findByIdAndDelete(req.body.id, (err, rtn) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      fs.unlink("public" + rtn.image, (err2) => {
        if (err2) {
          res.json({
            status: "error",
          });
        } else {
          res.json({
            status: true,
          });
        }
      });
    }
  });
};

exports.userAccDelete = (req, res) => {
  User.findByIdAndDelete(req.body.id, (err) => {
    if (err) {
      res.json({
        status: "error",
      });
    } else {
      res.json({
        status: true,
      });
    }
  });
};

exports.userEnable = (req, res) => {
  let update;
  if (req.body.status == "enable") {
    update = { disable: true };
  } else {
    update = { disable: false };
  }
  User.findByIdAndUpdate(req.body.id, { $set: update }, (err, rtn) => {
    if (err) {
      res.json({ status: "error" });
    } else {
      res.json({ status: true });
    }
  });
};

exports.campaignUpdate = (req, res) => {
  Campaign.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    res.render("admin/campaign-update", { camp: rtn });
  });
};

exports.loadCampaignUpdate = (req, res) => {
  if (req.file) {
    Campaign.findById(req.body.id)
      .select("image")
      .exec((err, rtn) => {
        if (err) throw err;
        fs.unlink("public" + rtn.image, (err1) => {
          if (err1) throw err1;
        });
      });
  }
  let update = {
    title: req.body.title,
    endDate: req.body.endDate,
    description: req.body.desc,
    update: moment().format("D MMMM YYYY, h:mm:ss A"),
  };
  if (req.file) update.image = "/images/upload/cover/" + req.file.filename;
  Campaign.findByIdAndUpdate(req.body.id, { $set: update }, (err2) => {
    if (err2) throw err2;
    res.redirect("/admin/campaign-detail/" + req.body.id);
  });
};

exports.campaignDataUpdate = (req, res) => {
  CampaignData.findById(req.params.id, (err, rtn) => {
    if (err) throw err;
    Campaign.findById(rtn.campaignId, (err1, rtn1) => {
      if (err1) throw err1;
      res.render("admin/campData-update", { campData: rtn, camp: rtn1 });
    });
  });
};

exports.loadCampaignDataUpdate = (req, res) => {
  if (req.file) {
    CampaignData.findById(req.body.dataId)
      .select("image")
      .exec((err5, rtn5) => {
        if (err5) throw err5;
        fs.unlink("public" + rtn5.image, (err6) => {
          if (err6) throw err6;
        });
      });
  }
  let dataUpdate = {
    name: req.body.name,
    description: req.body.desc,
    updateDate: moment().format("D MMMM YYYY, h:mm:ss A"),
  };
  if (req.file) dataUpdate.image = "/images/upload/img/" + req.file.filename;
  CampaignData.findByIdAndUpdate(
    req.body.dataId,
    { $set: dataUpdate },
    (err7) => {
      if (err7) throw err7;
      res.redirect("/admin/campaign-detail/" + req.body.campId);
    }
  );
};

exports.changeStatus = (req, res) => {
  switch (req.query.status) {
    case "open":
      Campaign.findByIdAndUpdate(
        req.query.id,
        { $set: { status: "close" } },
        (err) => {
          if (err) throw err;
          res.redirect("/admin/campaign-detail/" + req.query.id);
        }
      );
      break;
    case "close":
      Campaign.findByIdAndUpdate(
        req.query.id,
        { $set: { status: "finish" } },
        (err1) => {
          if (err1) throw err1;
          res.redirect("/admin/campaign-detail/" + req.query.id);
        }
      );
      break;
    case "finish":
      Campaign.findByIdAndUpdate(
        req.query.id,
        { $set: { status: "close" } },
        (err2) => {
          if (err2) throw err2;
          res.redirect("/admin/campaign-detail/" + req.query.id);
        }
      );
      break;
  }
};

exports.loadChangeStatus = (req, res) => {
  const totalT =
    (Number(req.body.hour) * 3600 + Number(req.body.minutes) * 60) * 1000;
  setTimeout(() => {
    Campaign.findByIdAndUpdate(
      req.body.campid,
      { $set: { status: "finish" } },
      (err) => {
        if (err) throw err;
        res.redirect(req.originalUrl);
      }
    );
  }, totalT);

  Campaign.findByIdAndUpdate(
    req.body.campid,
    {
      $set: {
        hour: req.body.hour,
        minutes: req.body.minutes,
        update: Date.now(),
      },
    },
    (err) => {
      if (err) throw err;
    }
  );
};
