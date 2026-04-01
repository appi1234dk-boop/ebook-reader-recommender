'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LandingPage } from './LandingPage'
import { QuizStep } from './QuizStep'
import { AnalyzingScreen } from './AnalyzingScreen'
import { ResultPage } from './ResultPage'
import { track, captureUTMParams } from '@/lib/analytics'
import { getRecommendation } from '@/lib/devices'
import type { AppStep, RecommendationResult } from '@/lib/types'

const QUESTIONS = [
  {
    step: 1,
    question: '현재 당신의 독서 상태는 어떤가요?',
    options: [
      { value: 'addict',  label: '숨 쉬듯 읽는 활자 중독자' },
      { value: 'casual',  label: '한 달에 한두 번 잠자는 뇌를 깨움' },
      { value: 'wannabe', label: '요즘 통 못 읽어서 장비빨 희망' },
    ],
  },
  {
    step: 2,
    question: '어떤 책을 주로 읽으시나요?',
    options: [
      { value: 'webnovel',   label: '물 흐르듯 읽는 소설 & 웹소설' },
      { value: 'nonfiction', label: '필요한 내용만 뽑아 읽는 비문학' },
      { value: 'academic',   label: '전문 지식 가득한 논문 & 원서' },
      { value: 'comic',      label: '시간 가는 줄 모르는 만화책' },
    ],
  },
  {
    step: 3,
    question: '주로 어디서 책을 읽으시나요?',
    options: [
      { value: 'commute', label: '지옥철/버스 (무조건 한 손!)' },
      { value: 'bed',     label: '자기 전 침대에서 뒹굴뒹굴' },
      { value: 'desk',    label: '책상이나 카페에서 각 잡고' },
    ],
  },
  {
    step: 4,
    question: '이북리더기에서 포기 못 하는 기능은?',
    options: [
      { value: 'light',  label: '압도적인 가벼움' },
      { value: 'button', label: '딸깍거리는 물리 버튼' },
      { value: 'color',  label: '생생한 컬러 화면' },
      { value: 'pen',    label: '자유로운 펜 필기' },
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
        setStep('analyzing')
      }

      pendingAnswerRef.current = null
      pendingAnswersRef.current = null
    }, 300)

    return () => clearTimeout(timer)
  }, [isExiting, quizStep])

  const handleAnalyzingComplete = useCallback(() => {
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
