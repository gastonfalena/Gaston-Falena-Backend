import mongoose, { Schema, Document } from "mongoose";

export interface IContainer extends Document {
  name: string;
  house: mongoose.Types.ObjectId;
  parentContainer?: mongoose.Types.ObjectId; // Referencia a sí mismo
  owner: mongoose.Types.ObjectId;
}

const containerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    house: { type: Schema.Types.ObjectId, ref: "House", required: true },
    parentContainer: {
      type: Schema.Types.ObjectId,
      ref: "Container",
      default: null,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IContainer>("Container", containerSchema);
