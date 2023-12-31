const bcrypt = require('bcrypt');
const crypto = require('crypto')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING
            },
            email: {
                type: DataTypes.STRING,
                unique: true,

            },
            password: {
                type: DataTypes.STRING(255),
                set(value) {
                    const saltRounds = 10;
                    const hashedPassword = bcrypt.hashSync(value, saltRounds);
                    this.setDataValue('password', hashedPassword);
                }
            },
            passwordChangedAt: {
                type: DataTypes.DATE
            },
            passwordCode: {
                type: DataTypes.STRING(255)
            },
            codeResetExpires: {
                type: DataTypes.STRING(255)
            },
            status: {
                type: DataTypes.BOOLEAN, defaultValue: true
            },
        },
        {
            timestamps: true,
        }
    )
    User.prototype.checkPassword = async function (newPassword) {
        try {
            const check = await bcrypt.compare(newPassword, this.password)
            console.log('check : ' + check)
            return check
        } catch (error) {
            console.log(error)

        }
    }
    User.prototype.createPasswordChangedToken = async function (genericParam) {
        try {
            const code = crypto.randomInt(100000, 1000000);
            console.log("code = " + code);
            this.passwordCode = crypto.createHash('sha256').update(code.toString()).digest('hex');
            this.codeResetExpires = Date.now() + 15 * 60 * 1000;
            return code;
        } catch (error) {
            console.log(error);
        }
    }

    return User
}