
import { NextResponse } from 'next/server';

/**
 * System Health Check API
 * Verifies that the REST API Module is online.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ACTIVE',
    system: 'Buildoholics HMS',
    version: '4.0.2',
    node: 'ALPHA-7',
    timestamp: new Date().toISOString()
  });
}
