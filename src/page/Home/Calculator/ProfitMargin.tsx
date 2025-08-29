import { useState, useEffect } from 'react'
import TemplateInput from './components/Input'
import TemplateResult from './components/Result'
import { CalculatorEnum, useCalculator } from './context/calculatorContext'

export default function ProfitMargin() {
  const {
    setAnnualIncome,
    setAnnualExpense,
    calculateProfitMargin,
    profitMargin,
    annualIncome,
    annualExpense,
    annualSaving,
    resetProfitMarginCalculation,
    setActiveCalculatorState,
  } = useCalculator()
  // setActiveCalculatorState({
  //       calculator: CalculatorEnum.InvestmentPercentage,
  //       stage: 0,
  //     })

  const [input1, setInput1] = useState<string>('')
  const [input2, setInput2] = useState<string>('')
  const [activeScreen, setActiveScreen] = useState<string>('step1')
  const [shouldCalculate, setShouldCalculate] = useState(false)

  const handleNext = () => {
    if (activeScreen === 'step1') {
      if (input1 !== '' && input2 !== '') {
        const income = parseFloat(input1)
        const expense = parseFloat(input2)

        setAnnualIncome(income)
        setAnnualExpense(expense)

        setShouldCalculate(true) // trigger calculation in useEffect
      }
    }
  }

  useEffect(() => {
    if (shouldCalculate) {
      calculateProfitMargin()
      setShouldCalculate(false)
    }
  }, [shouldCalculate])

  useEffect(() => {
    if (profitMargin !== null && activeScreen === 'step1') {
      setActiveScreen('step2')
    }
  }, [profitMargin])
  // ✅ Auto-sync inputs with context values
  useEffect(() => {
    if (annualIncome !== null) setInput1(String(annualIncome))
    if (annualExpense !== null) setInput2(String(annualExpense))
  }, [annualIncome, annualExpense])

  const handleRecalculate = () => {
    resetProfitMarginCalculation()
    // setInput1('')
    // setInput2('')
    setActiveScreen('step1')
  }

  return (
    <div className='h-full w-full'>
      {activeScreen === 'step1' && (
        <TemplateInput
          heading='Know Your Profit Margin'
          subheading='For Individual’s Profit Margin is the Savings Rate'
          placeholder1='Enter Annual Income'
          placeholder2='Enter Annual Expense'
          input1={input1}
          input2={input2}
          setInput1={setInput1}
          setInput2={setInput2}
          handleNext={handleNext}
        />
      )}
      {activeScreen === 'step2' && (
        <TemplateResult
          heading='Your Profit Margin is'
          subheading={`${profitMargin !== null ? `${profitMargin} %` : 'N/A'}`}
          handleRecalculate={handleRecalculate}
          handleNext={() => {
            setActiveCalculatorState({
              calculator: CalculatorEnum.InvestmentPercentage,
              stage: 0,
            })
          }}
        />
      )}
    </div>
  )
}
