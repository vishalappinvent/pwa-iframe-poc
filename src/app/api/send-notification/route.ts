import { NextResponse } from 'next/server';
import { messaging } from '../../firebase/admin';
import { getServerTokens, getServerTokenCount } from '../../utils/serverTokenStorage';

export async function POST(request: Request) {
  try {
    const { title, body } = await request.json();
    console.log('Received notification request:', { title, body });

    // Get all registered tokens from server storage
    const tokens = getServerTokens();
    const tokenCount = getServerTokenCount();
    
    console.log('Server token storage status:', {
      tokens,
      tokenCount,
      hasTokens: tokens.length > 0
    });

    if (tokens.length === 0) {
      console.warn('No tokens found in server storage');
      return NextResponse.json(
        { 
          error: 'No registered devices found',
          message: 'Please ensure you have granted notification permissions and reloaded the page'
        },
        { status: 400 }
      );
    }

    console.log('Sending message to tokens:', tokens);
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      android: {
        priority: 'high' as const,
        notification: {
          channelId: 'default',
          priority: 'high' as const,
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
        notification: {
          requireInteraction: true,
        },
      },
    });
    
    // Log the results
    console.log('Message sending results:', {
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    });
    
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error('Failed to send to token:', {
            token: tokens[idx],
            error: resp.error
          });
        }
      });
      console.log('Failed tokens:', failedTokens);
    }

    return NextResponse.json({
      success: true,
      response: {
        successCount: response.successCount,
        failureCount: response.failureCount,
        totalTokens: tokens.length
      },
    });
  } catch (error) {
    console.error('Error in send-notification route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send notification', 
        details: error instanceof Error ? error.message : 'Unknown error',
        message: 'Please check the server logs for more details'
      },
      { status: 500 }
    );
  }
} 