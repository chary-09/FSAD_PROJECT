
import { NextResponse } from 'next/server';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

/**
 * REST API Module: Handles Booking Data Operations
 * This provides a standard JSON endpoint for reservation summaries.
 */
export async function GET() {
  try {
    const { firestore } = initializeFirebase();
    const resCol = collection(firestore, 'reservations');
    const snapshot = await getDocs(resCol);
    const reservations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: reservations
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
