'use client';
import runChat from '@/lib/gemini';
import React, { createContext, useState } from 'react';

export const Context = createContext();

// 컨텍스트 프로바이더 컴포넌트를 생성합니다. 이 컴포넌트는 앱의 다른 부분에서 사용될 상태와 함수를 제공합니다.
const ContextProvider = ({ children }) => {
  // 여러 상태 변수들을 정의합니다.
  const [theme, setTheme] = useState('dark'); // 테마 상태 (기본값은 'dark')
  const [input, setInput] = useState(''); // 사용자 입력
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [result, setResult] = useState([]); // API로부터 받은 결과
  const [recentPrompts, setRecentPrompts] = useState(''); // 최근 프롬프트
  const [displayResult, setDisplayResult] = useState(false); // 결과 표시 여부
  const [prevPrompts, setPrevPrompts] = useState([]); // 이전 프롬프트 목록

  // 결과 문자열에 애니메이션 효과를 주기 위한 함수
  const paragraphDelay = (index, newWord) => {
    setTimeout(() => {
      setResult(prev => prev + newWord);
    }, 70 * index);
  };

  // 사용자가 입력을 제출했을 때 실행되는 함수
  const submit = async prompt => {
    try {
      setLoading(true); // 로딩 상태를 true로 설정
      setResult(''); // 결과 초기화
      setDisplayResult(true); // 결과 표시

      // 입력 또는 프롬프트가 있을 경우, 최근 프롬프트 업데이트
      if (input || prompt) {
        setRecentPrompts(prev => [...prev, input || prompt]);
        setPrevPrompts(prev => [...prev, input || prompt]);
      }

      // 입력 또는 프롬프트를 사용하여 runChat 함수 호출
      const response = await runChat(input || prompt);

      // 받은 응답을 포맷팅
      const formattedResponse = formatResponseText(response);

      // 포맷팅된 응답을 딜레이와 함께 표시
      displayResponseWithDelay(formattedResponse);
    } catch (error) {
      console.error('Error submitting prompt:', error); // 오류 처리
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
      setInput(''); // 입력 초기화
    }
  };

  // 컨텍스트에 포함될 값들을 정의합니다.
  const contextValue = {
    theme,
    submit,
    setInput,
    input,
    result,
    loading,
    displayResult,
    recentPrompts,
    setRecentPrompts,
    setPrevPrompts,
    prevPrompts,
    setDisplayResult,
  };

  // Context.Provider를 사용하여 contextValue를 자식 컴포넌트로 전달합니다.
  return (
    <Context.Provider value={contextValue}>
      <div className={theme}>{children}</div>
    </Context.Provider>
  );
};

export default ContextProvider;
