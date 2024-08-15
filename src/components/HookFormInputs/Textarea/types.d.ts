import { TextareaHTMLAttributes } from 'react'

export interface TextAreaProps
  extends TextareaHTMLAttributes<TextareaHTMLAttributes> {
  label?: string
  height?: string
  error?: string
  showTextLengthCounter?: boolean
  textLength?: number
}
