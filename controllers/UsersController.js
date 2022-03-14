const bcrypt = require("bcryptjs");
const UsersModel = require("../models/Users");
var jwt = require("jsonwebtoken");
const {
  sendConfirmationEmail,
  sendRecoveryEmail,
} = require("../config/nodemailer");

const RegisterUser = async (req, res) => {
  const token = jwt.sign({ email: req.body.email }, process.env.SECRET);

  const regData = new UsersModel({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 5),
    confirmationCode: token,
  });

  try {
    await regData.save();
    sendConfirmationEmail(regData.name, regData.email, token);
    res.status(200).send("Registration completed please verifiy your email");
  } catch (error) {
    res.send(error.message);
  }
};

const verifyUser = async (req, res) => {
  const result = await UsersModel.findOne({
    confirmationCode: req.query.confirm_code,
  });

  if (!result) {
    res.status(400).send("No record found");
  } else {
    await UsersModel.findOneAndUpdate(
      {
        _id: result._id,
      },
      {
        $set: {
          status: "Active",
        },
      }
    );

    res.status(200).json({ message: "Account verified you can now login" });
  }
};

const Auth = async (req, res) => {
  const { email, password } = req.body;
  const userData = await UsersModel.findOne({ email });
  if (!userData) {
    res.send("Record not found!");
  } else {
    if (userData.status != "Active") {
      res.status(400).json({ message: "Please verify your email first" });
    } else {
      bcrypt.compare(password, userData.password, (err, result) => {
        if (result) {
          var token = jwt.sign({ _id: userData._id }, "NovaIntern");

          res.status(200).json({ token });
        } else {
          res.send("Password is incorrect");
        }
      });
    }
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await UsersModel.findOne({ email });

    if (result) {
      const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
      await UsersModel.findOneAndUpdate(
        { _id: result._id },
        {
          $set: {
            reset_token: token,
          },
        }
      );
      sendRecoveryEmail(result.name, result.email, token);
      res
        .status(200)
        .json({ message: "Password reset link sent to your registered email" });
    } else {
      res
        .status(400)
        .json({ message: "No record found against this email address" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const result = await UsersModel.findOne({
      reset_token: req.query.reset_token,
    });
    if (result) {
      await UsersModel.findOneAndUpdate(
        { _id: result._id },
        {
          $set: {
            password: bcrypt.hashSync(req.body.password, 5),
          },
        }
      );
      res.status(200).json({ message: "Password Updated Successfully!" });
    } else {
      res.status(400).json({ message: "No record found!" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  RegisterUser,
  Auth,
  verifyUser,
  resetPassword,
  updatePassword,
};
