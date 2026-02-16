import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  name: string;
  description?: string;
  quantity: number;
  container: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
}

const itemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    quantity: {
      type: Number,
      default: 1,
    },
    container: {
      type: Schema.Types.ObjectId,
      ref: "Container",
      required: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IItem>("Item", itemSchema);
