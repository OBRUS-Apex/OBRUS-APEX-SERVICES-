import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
  try {
    const { invoiceId, receiptUrl } = await req.json();

    if (!invoiceId || !receiptUrl) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('invoices')
      .update({ 
        receipt_url: receiptUrl,
        status: 'verifying' 
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, invoice: data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
