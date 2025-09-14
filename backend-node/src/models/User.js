import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String },
    ip: { type: String },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokens: { type: [RefreshTokenSchema], default: [] },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

const User = mongoose.model('User', UserSchema);
export default User;
