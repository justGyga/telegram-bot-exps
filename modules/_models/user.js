import { DataTypes, Model } from "sequelize";

export const ROLES = {
    ADMIN: 0,
    WORKER: 1
};

export class User extends Model {}

export const userPlotter = (connection) => {
    User.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            role: {
                type: DataTypes.SMALLINT,
                validate: { isIn: [Object.values(ROLES)] },
                defaultValue: 1
            },
            telegramId: { type: DataTypes.INTEGER, allowNull: false }
        },
        {
            sequelize: connection,
            updatedAt: false,
            tableName: "users"
        }
    );

    return () => {};
};
