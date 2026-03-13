import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  status: { type: String, enum: ['pending', 'vetted', 'offered', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);