import { Schema, model } from "mongoose";

const fileSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: [true, "Uploaded file must have a name"],
  },
});

const File = model("File", fileSchema);

export default File;
