'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LandingPage } from './LandingPage'
import { QuizStep } from './QuizStep'
import { AnalyzingScreen } from './AnalyzingScreen'
import { ResultPage } from './ResultPage'
import { track, captureUTMParams } from '@/lib/analytics'
import { getRecommendation } from '@/lib/devices'
import type { AppStep, RecommendationResult, AiContent } from '@/lib/types'

async function fetchAiContent(
  answers: Record<number, string>,
  device: RecommendationResult['primary']
): Promise<AiContent | null> {
  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        device: {
          name: device.name,
          brand: device.brand,
          size: device.size,
          priceRange: device.priceRange,
          physicalButton: device.physicalButton,
          hasColor: device.hasColor,
          releaseYear: device.releaseYear,
          priceTier: device.priceTier,
          origin: device.origin,
        },
      }),
    })
    const data = await res.json()
    return data.aiContent ?? null
  } catch {
    return null
  }
}

const QUESTIONS = [
  {
    step: 1,
    question: 'Q1. 요즘 책은 얼마나 읽고있나요?',
    options: [
      { value: 'addict',  label: '일주일에 1권은 읽어요' },
      { value: 'casual',  label: '한 달에 1~2권 정도..?' },
      { value: 'wannabe', label: '바빠서 거의 못 읽고 있어요' },
    ],
  },
  {
    step: 2,
    question: 'Q2. 어떤 책을 주로 읽으시나요?',
    options: [
      { value: 'webnovel',   label: '소설 & 웹소설, 물 흐르듯 읽는게 좋아요' },
      { value: 'nonfiction', label: '비문학! 필요한 내용만 뽑아 읽어요' },
      { value: 'academic',   label: '논문이요. 전문 지식을 주로 습득합니다' },
      { value: 'comic',      label: '만화책 읽으면서 시간을 보내요' },
    ],
  },
  {
    step: 3,
    question: 'Q3. 주로 어디서 책을 읽으시나요?',
    options: [
      { value: 'commute', label: '지하철, 버스처럼 이동중에 주로 읽어요' },
      { value: 'bed',     label: '자기 전에 침대에서 눕독해요' },
      { value: 'desk',    label: '집이나 카페에서 각 잡고 읽어요' },
    ],
  },
  {
    step: 4,
    question: 'Q4. 이북리더기에서 포기 못 하는 기능은?',
    options: [
      { value: 'light',  label: '가벼운게 최고!' },
      { value: 'button', label: '물리버튼이 있으면 좋겠어요' },
      { value: 'color',  label: '생생한 컬러 화면이 필요해요' },
      { value: 'pen',    label: '스타일러스 펜이 꼭 필요해요' },
    ],
  },
  {
    step: 5,
    question: 'Q5. 예산은 얼마나 생각하고 계세요?',
    options: [
      { value: 'budget_under20', label: '20만원 미만이면 좋겠어요' },
      { value: 'budget_30s',     label: '30만원대까지는 괜찮아요' },
      { value: 'budget_40s',     label: '40만원대까지 생각하고 있어요' },
      { value: 'budget_over50',  label: '50만원 이상도 괜찮아요' },
    ],
  },
  {
    step: 6,
    question: 'Q6. 해외직구 상품도 괜찮으신가요?',
    options: [
      { value: 'import',   label: '중국에서 넘어와도 괜찮아요' },
      { value: 'domestic', label: '한국에서 배송받고 싶어요' },
    ],
  },
]

interface EbookQuizProps {
  initialUtmSource: string | null
}

export function EbookQuiz({ initialUtmSource }: EbookQuizProps) {
  const [step, setStep] = useState<AppStep>('landing')
  const [quizStep, setQuizStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const pendingAnswerRef = useRef<string | null>(null)
  const pendingAnswersRef = useRef<Record<number, string> | null>(null)
  const aiPromiseRef = useRef<Promise<AiContent | null> | null>(null)

  useEffect(() => {
    captureUTMParams()
    track('page_view', { utm_source: initialUtmSource })
  }, [initialUtmSource])

  const handleStart = useCallback(() => {
    track('quiz_start')
    setStep('quiz')
    setQuizStep(0)
  }, [])

  const handleAnswer = useCallback((answerValue: string) => {
    const currentQ = QUESTIONS[quizStep]
    track('quiz_answer', { step: currentQ.step, answer: answerValue })

    const newAnswers = { ...answers, [quizStep]: answerValue }

    pendingAnswerRef.current = answerValue
    pendingAnswersRef.current = newAnswers
    setIsExiting(true)
  }, [quizStep, answers])

  useEffect(() => {
    if (!isExiting) return

    const timer = setTimeout(() => {
      const newAnswers = pendingAnswersRef.current!
      setAnswers(newAnswers)
      setIsExiting(false)

      if (quizStep < QUESTIONS.length - 1) {
        setQuizStep(q => q + 1)
      } else {
        track('quiz_complete', { answers: newAnswers })
        const recommendation = getRecommendation(newAnswers)
        setResult(recommendation)
        aiPromiseRef.current = fetchAiContent(newAnswers, recommendation.primary)
        setStep('analyzing')
      }

      pendingAnswerRef.current = null
      pendingAnswersRef.current = null
    }, 300)

    return () => clearTimeout(timer)
  }, [isExiting, quizStep])

  const handleAnalyzingComplete = useCallback(async () => {
    const aiContent = await (aiPromiseRef.current ?? Promise.resolve(null)).catch(() => null)
    if (aiContent) {
      setResult(prev => prev ? { ...prev, aiContent } : prev)
    }
    if (result) {
      track('result_view', {
        type: result.resultType,
        rate: result.probability,
        device1: result.primary.id,
        device2: result.secondary.id,
      })
    }
    setStep('result')
  }, [result])

  const handleRestart = useCallback(() => {
    setStep('landing')
    setQuizStep(0)
    setAnswers({})
    setResult(null)
  }, [])

  if (step === 'landing') {
    return <LandingPage onStart={handleStart} />
  }

  if (step === 'quiz') {
    const currentQ = QUESTIONS[quizStep]
    return (
      <QuizStep
        key={quizStep}
        questionNumber={currentQ.step}
        totalQuestions={QUESTIONS.length}
        question={currentQ.question}
        options={currentQ.options}
        onAnswer={handleAnswer}
        isExiting={isExiting}
      />
    )
  }

  if (step === 'analyzing') {
    return <AnalyzingScreen onComplete={handleAnalyzingComplete} />
  }

  if (step === 'result' && result) {
    return <ResultPage result={result} onRestart={handleRestart} />
  }

  return null
}
