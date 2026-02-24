import mongoose, { Schema, Document } from "mongoose";

export interface IHouse extends Document {
  name: string;
  address?: string;
  owner: mongoose.Types.ObjectId;
}

const houseSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IHouse>("House", houseSchema);
