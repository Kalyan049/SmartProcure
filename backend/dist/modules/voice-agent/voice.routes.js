"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceToolDispatcher = void 0;
const express_1 = require("express");
const apiResponse_1 = require("../../utils/apiResponse");
class VoiceToolDispatcher {
    async handleVoiceIntent(intent, params, language = 'en') {
        switch (intent) {
            case 'CHECK_QUEUE':
                return {
                    spokenResponse: language === 'hi'
                        ? 'आपका टोकन नंबर SP-1047 है। आपकी कतार स्थिति सात है, और आगे छह किसान हैं।'
                        : language === 'te'
                            ? 'మీ టోకెన్ నంబర్ SP-1047. మీ క్యూ స్థానం ఏడు, మీ ముందు ఆరుగురు రైతులు ఉన్నారు.'
                            : 'Your token is SP-1047. You are position number 7 with 6 farmers ahead.',
                    data: { token: 'SP-1047', position: 7, waitMinutes: 35 },
                };
            case 'SHOULD_I_GO_NOW':
                return {
                    spokenResponse: language === 'hi'
                        ? 'हाँ, अभी निकलें। आपकी कतार तेजी से आगे बढ़ रही है।'
                        : language === 'te'
                            ? 'అవును, ఇప్పుడే బయలుదేరండి. క్యూ వేగంగా కదులుతోంది.'
                            : 'Yes, go now! The queue is moving quickly and your slot is ready.',
                    data: { decision: 'GO NOW', departureTime: '10:15 AM' },
                };
            default:
                return {
                    spokenResponse: language === 'hi'
                        ? 'नमस्ते, मैं स्मार्टप्रोक्योर वॉयस सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ?'
                        : language === 'te'
                            ? 'నమస్కారం, నేను స్మార్ట్‌ప్రొక్యూర్ వాయిస్ అసిస్టెంట్‌ని. మీకు ఎలా సహాయపడగలను?'
                            : 'Hello, I am SmartProcure Voice Assistant. How can I help you today?',
                    data: {},
                };
        }
    }
}
exports.VoiceToolDispatcher = VoiceToolDispatcher;
const voiceDispatcher = new VoiceToolDispatcher();
const router = (0, express_1.Router)();
router.post('/interact', async (req, res) => {
    const { intent = 'WELCOME', params = {}, language = 'en' } = req.body;
    const result = await voiceDispatcher.handleVoiceIntent(intent, params, language);
    return apiResponse_1.ApiResponseHandler.success(res, result);
});
router.post('/outbound/simulate', (req, res) => {
    const { bookingId = 'bk-1047', eventType = 'QUEUE_SURGE' } = req.body;
    return apiResponse_1.ApiResponseHandler.success(res, {
        callId: `call-${Date.now()}`,
        bookingId,
        eventType,
        status: 'RINGING',
        script: 'SmartProcure Update: Your slot at Center B has moved forward. Recommended departure time is 10:15 AM.',
    });
});
exports.default = router;
