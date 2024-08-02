const { db } = require("../models");
const { hashPassword } = require("./auth_controller");

class ParentController {
  static async postNewParent(req, res) {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "password",
    ];
    const formData = req.body;
    const { email, password } = formData;
    let missingField;

    const isMissingField = requiredFields.some((field) => {
      if (!formData[field]) {
        missingField = field;
        return true;
      }
      return false;
    });

    if (isMissingField) {
      res
        .status(400)
        .json({ error: `Missing ${missingField.replace("_", " ")}` });
      return;
    }

    const parent = await db.Parent.findOne({ where: { email } });
    if (parent) {
      res.status(400).json({ error: "Parent already exist" });
      return;
    }

    const hashedPassword = hashPassword(password);
    formData.password = hashedPassword;
    const id = await db.Parent.create(formData);
    res.status(201).json({
      id: id.insertedId,
      email,
    });
  }

  static async getParentById(req, res) {
    const { id } = req.params;
    const parent = await db.Parent.findByPk(id);

    if (
      parent &&
      Boolean(req.user.isParent) &&
      parent.id !== req.user.dataValues.id
    ) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    if (!parent) {
      res.status(404).json({ error: "Parent not found" });
      return;
    }

    delete parent.dataValues.password;

    res.status(200).json(parent);
  }
}

module.exports = { ParentController };
