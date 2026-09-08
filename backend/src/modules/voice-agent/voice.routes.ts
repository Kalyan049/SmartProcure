import { Router, Request, Response } from 'express';
import { ApiResponseHandler } from '../../utils/apiResponse';

export class VoiceToolDispatcher {
  async handleVoiceIntent(intent: string, params: Record<string, unknown>, language: string = 'en') {
    switch (intent) {
      case 'CHECK_QUEUE':
        return {
          spokenResponse:
            language === 'hi'
              ? 'आपका टोकन नंबर SP-1047 है। आपकी कतार स्थिति सात है, और आगे छह किसान हैं।'
              : language === 'te'
              ? 'మీ టోకెన్ నంబర్ SP-1047. మీ క్యూ స్థానం ఏడు, మీ ముందు ఆరుగురు రైతులు ఉన్నారు.'
              : 'Your token is SP-1047. You are position number 7 with 6 farmers ahead.',
          data: { token: 'SP-1047', position: 7, waitMinutes: 35 },
        };
      case 'SHOULD_I_GO_NOW':
        return {
          spokenResponse:
            language === 'hi'
              ? 'हाँ, अभी निकलें। आपकी कतार तेजी से आगे बढ़ रही है।'
              : language === 'te'
              ? 'అవును, ఇప్పుడే బయలుదేరండి. క్యూ వేగంగా కదులుతోంది.'
              : 'Yes, go now! The queue is moving quickly and your slot is ready.',
          data: { decision: 'GO NOW', departureTime: '10:15 AM' },
        };
      default:
        return {
          spokenResponse:
            language === 'hi'
              ? 'नमस्ते, मैं स्मार्टप्रोक्योर वॉयस सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?'
              : language === 'te'
              ? 'నమస్కారం, నేను స్మార్ట్‌ప్రొక్యూర్ వాయిస్ అసిస్టెంట్‌ని. మీకు ఎలా సహాయపడగలను?'
              : 'Hello, I am SmartProcure Voice Assistant. How can I help you today?',
          data: {},
        };
    }
  }
}

const voiceDispatcher = new VoiceToolDispatcher();
const router = Router();

router.post('/interact', async (req: Request, res: Response) => {
  const { intent = 'WELCOME', params = {}, language = 'en' } = req.body;
  const result = await voiceDispatcher.handleVoiceIntent(intent, params, language);
  return ApiResponseHandler.success(res, result);
});

router.post('/outbound/simulate', (req: Request, res: Response) => {
  const { bookingId = 'bk-1047', eventType = 'QUEUE_SURGE' } = req.body;
  return ApiResponseHandler.success(res, {
    callId: `call-${Date.now()}`,
    bookingId,
    eventType,
    status: 'RINGING',
    script: 'SmartProcure Update: Your slot at Center B has moved forward. Recommended departure time is 10:15 AM.',
  });
});

export default router;
