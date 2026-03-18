import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ message: "User ID required" }, { status: 400 });

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  const formattedData = data.map(inv => ({
    _id: inv.id,
    invoiceNumber: inv.invoice_number,
    serviceType: inv.service_type,
    amount: inv.amount,
    status: inv.status,
    receiptUrl: inv.receipt_url,
    createdAt: inv.created_at
  }));

  return NextResponse.json(formattedData, { status: 200 });
}
