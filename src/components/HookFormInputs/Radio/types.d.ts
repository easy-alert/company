import { InputHTMLAttributes } from 'react'

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelColor?: string
  errorColor?: string
  error?: string
  marginTop?: string
}
