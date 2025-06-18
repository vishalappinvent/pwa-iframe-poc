import { NextResponse } from 'next/server';
import { addServerToken } from '../../utils/serverTokenStorage';
import { getServerTokenCount } from '../../utils/serverTokenStorage';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    addServerToken(token);
    
    return NextResponse.json({
      success: true,
      message: 'Token registered successfully',
      tokenCount: getServerTokenCount()
    });
  } catch (error) {
    console.error('Error registering token:', error);
    return NextResponse.json(
      { 
        error: 'Failed to register token',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 