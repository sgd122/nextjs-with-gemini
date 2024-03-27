import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

// 모델 이름과 API 키를 정의합니다. API 키는 환경 변수에서 가져옵니다.
const MODEL_NAME = 'gemini-1.0-pro';
const API_KEY = `${process.env.NEXT_PUBLIC_API_KEY}`;

// 사용자의 프롬프트에 대해 응답을 생성하는 함수
async function runChat(prompt) {
  // Google 생성적 AI 객체를 생성하고, API 키를 사용하여 초기화합니다.
  const genAI = new GoogleGenerativeAI(API_KEY);
  // 사용할 모델을 설정합니다.
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  // 생성 설정: 응답의 다양성을 조절하는 온도, top-k 샘플링, top-p 샘플링, 최대 출력 토큰 수를 정의합니다.
  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  // 안전 설정: 특정 유형의 해로운 콘텐츠를 차단하기 위한 설정입니다.
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  // 챗봇 세션을 시작합니다. 여기에는 생성 설정, 안전 설정, 그리고 이전 대화의 역사(history)가 포함됩니다.
  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });

  // 사용자의 프롬프트에 대한 메시지를 전송하고, 응답을 받습니다.
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text()); // 콘솔에 응답 텍스트를 출력합니다.
  return response.text(); // 응답 텍스트를 반환합니다.
}

export default runChat;
