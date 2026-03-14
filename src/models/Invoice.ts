import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, unique: true, required: true },
  serviceType: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['unpaid', 'verifying', 'paid'], default: 'unpaid' },
  receiptUrl: { type: String, default: null },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);