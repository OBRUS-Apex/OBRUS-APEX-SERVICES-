import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['HSE Consultancy', 'Recruitment', 'Environmental', 'Technical'], required: true },
  location: { type: String, required: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  description: { type: String, required: true },
  requirements: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);