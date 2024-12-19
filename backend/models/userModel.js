import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  deliveryInfo: { // Default to 'NA' for all fields
    firstName: { type: String, default: 'NA' },
    lastName: { type: String, default: 'NA' },
    street: { type: String, default: 'NA' },
    city: { type: String, default: 'NA' },
    state: { type: String, default: 'NA' },
    zipcode: { type: String, default: 'NA' },
    country: { type: String, default: 'NA' },
    phone: { type: String, default: 'NA' }
  }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
