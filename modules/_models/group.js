import { DataTypes, Model } from "sequelize";

export class Group extends Model {}

export const groupPlotter = (connection) => {
    Group.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: { type: DataTypes.STRING, defaultValue: "No-Name" },
            telegramId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                validate: {
                    isNegative(value) {
                        if (value >= 0) {
                            throw new Error("Значение должно быть меньше нуля");
                        }
                    }
                }
            }
        },
        {
            sequelize: connection,
            updatedAt: false,
            tableName: "groups"
        }
    );

    return () => {};
};
